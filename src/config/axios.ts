import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { supabase } from './supabase';
import { markSessionExpired } from '@/utils/sessionExpired';
import * as Sentry from "@sentry/react";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retryCount?: number;
	_retry?: boolean;
}

// Returns true only when Supabase explicitly rejects the refresh token.
// Network errors, 5xx, timeouts, and aborted requests return false — those
// are transient and should never force a logout.
function isTerminalAuthError(err: unknown): boolean {
	if (!err || typeof err !== 'object') return false;
	const e = err as Record<string, unknown>;
	// AuthApiError from the Supabase SDK — explicit 400/401 from the auth server
	if (e['name'] === 'AuthApiError' && (e['status'] === 400 || e['status'] === 401)) return true;
	// AuthSessionMissingError — there was genuinely no session to refresh
	if (e['name'] === 'AuthSessionMissingError') return true;
	return false;
}

// Create axios instance with base configuration
const apiClient = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
	timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	async (config) => {
		const customConfig = config as CustomAxiosRequestConfig;

		const { data: { session } } = await supabase.auth.getSession();

		if (session?.access_token) {
			customConfig.headers.Authorization = `Bearer ${session.access_token}`;
		}

		customConfig._retryCount = customConfig._retryCount || 0;

		Sentry.addBreadcrumb({
			category: 'api.request',
			message: `${customConfig.method?.toUpperCase()} ${customConfig.url}`,
			level: 'info',
			data: {
				method: customConfig.method,
				url: customConfig.url,
				baseURL: customConfig.baseURL,
				retryCount: customConfig._retryCount
			}
		});

		return customConfig;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle 401 errors and retry logic
apiClient.interceptors.response.use(
	(response) => {
		console.log('🌐 [API Response]', {
			url: response.config.url,
			status: response.status,
			data: response.data
		});

		Sentry.addBreadcrumb({
			category: 'api.response',
			message: `${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
			level: 'info',
			data: {
				method: response.config.method,
				url: response.config.url,
				status: response.status,
				statusText: response.statusText
			}
		});

		return response;
	},
	async (error: AxiosError) => {
		const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

		console.error('🌐 [API Error]', {
			url: originalRequest?.url,
			status: error.response?.status,
			data: error.response?.data,
			code: error.code,
			retryCount: originalRequest?._retryCount
		});

		Sentry.addBreadcrumb({
			category: 'api.error',
			message: `${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - ${error.response?.status || error.code}`,
			level: 'error',
			data: {
				method: originalRequest?.method,
				url: originalRequest?.url,
				status: error.response?.status,
				statusText: error.response?.statusText,
				code: error.code,
				retryCount: originalRequest?._retryCount,
				errorData: error.response?.data
			}
		});

		// Handle 401 — attempt a single token refresh, then retry the request.
		// The Supabase SDK serializes concurrent refresh calls via navigator.locks,
		// so we don't need a local isRefreshing queue here.
		if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const { data, error: refreshError } = await supabase.auth.refreshSession();

				if (refreshError) throw refreshError;
				if (!data.session) throw new Error('No session returned after refresh');

				originalRequest.headers['Authorization'] = `Bearer ${data.session.access_token}`;
				return apiClient(originalRequest);
			} catch (refreshError) {
				if (isTerminalAuthError(refreshError)) {
					Sentry.addBreadcrumb({
						category: 'auth.refresh',
						message: 'Session expired (terminal) — logging out',
						level: 'info',
						data: {
							error: refreshError instanceof Error ? refreshError.message : String(refreshError)
						}
					});
					window.dispatchEvent(new CustomEvent('auth:session-expired'));

					markSessionExpired(error);
					return Promise.reject(error);
				} else {
					// Transient error (network blip, 5xx, timeout). The session is
					// likely still valid — don't log the user out, just surface the error.
					Sentry.addBreadcrumb({
						category: 'auth.refresh',
						message: 'Token refresh failed (transient)',
						level: 'warning',
						data: {
							error: refreshError instanceof Error ? refreshError.message : String(refreshError)
						}
					});
				}
				return Promise.reject(refreshError);
			}
		}

		// Retry logic for network errors and empty responses
		if (
			(error.code === 'ERR_NETWORK' || error.code === 'ERR_EMPTY_RESPONSE') &&
			originalRequest &&
			originalRequest._retryCount !== undefined &&
			originalRequest._retryCount < 3
		) {
			originalRequest._retryCount += 1;

			console.log(`🔄 [API Retry] Attempt ${originalRequest._retryCount}/3 for ${originalRequest.url}`);

			Sentry.addBreadcrumb({
				category: 'api.retry',
				message: `Retrying ${originalRequest.method?.toUpperCase()} ${originalRequest.url} (Attempt ${originalRequest._retryCount}/3)`,
				level: 'warning',
				data: {
					method: originalRequest.method,
					url: originalRequest.url,
					retryCount: originalRequest._retryCount,
					reason: error.code
				}
			});

			await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount!));
			return apiClient(originalRequest);
		}

		return Promise.reject(error);
	}
);

export default apiClient;
