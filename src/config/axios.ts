import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { supabase } from './supabase';
import * as Sentry from "@sentry/react";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retryCount?: number;
	_retry?: boolean;
}
interface QueuedRequest {
	resolve: (token: string | null) => void;
	reject: (error: unknown) => void;
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

		// Get the current session
		const { data: { session } } = await supabase.auth.getSession();

		if (session?.access_token) {
			customConfig.headers.Authorization = `Bearer ${session.access_token}`;
		}

		// Add retry tracking
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

// Queue to hold requests while refreshing token
let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
  
	failedQueue = [];
};

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
	async (error) => {
		const originalRequest = error.config;

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

		// Handle 401 Unauthorized errors
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise(function(resolve, reject) {
					failedQueue.push({ resolve, reject });
				}).then(token => {
					originalRequest.headers['Authorization'] = 'Bearer ' + token;
					return apiClient(originalRequest);
				}).catch(err => {
					return Promise.reject(err);
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const { data, error: refreshError } = await supabase.auth.refreshSession();
        
				if (refreshError || !data.session) {
					throw refreshError || new Error('No session returned after refresh');
				}

				const newToken = data.session.access_token;
        
				// Update the header for the original request
				originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
				// Process any queued requests
				processQueue(null, newToken);
        
				return apiClient(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
        
				// Dispatch session expired event so AuthContext can handle it
				const event = new CustomEvent('auth:session-expired');
				window.dispatchEvent(event);
        
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		// Retry logic for network errors and empty responses
		if (
			(error.code === 'ERR_NETWORK' || error.code === 'ERR_EMPTY_RESPONSE') &&
			originalRequest &&
			originalRequest._retryCount < 3
		) {
			originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

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

			// Wait before retrying (exponential backoff)
			await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount));

			return apiClient(originalRequest);
		}

		return Promise.reject(error);
	}
);

export default apiClient;