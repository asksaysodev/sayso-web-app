import { useState, useEffect } from 'react';
import ViewLayout from '@/components/layouts/ViewLayout';
import SaysoButton from '@/components/SaysoButton';
import apiClient from '@/config/axios';
import './styles.css';

interface Invite {
    id: string;
    email: string;
    status: string;
    expires_at: string;
}

export default function InviteTest() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [invites, setInvites] = useState<Invite[] | null>(null);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [revokingId, setRevokingId] = useState<string | null>(null);
    const [resendingId, setResendingId] = useState<string | null>(null);

    const fetchCompany = async () => {
        setCompanyLoading(true);
        try {
            const response = await apiClient.get('/accounts/company');
            setInvites(response.data?.invites ?? null);
        } catch (err) {
            console.error('Failed to fetch company:', err);
            setInvites(null);
        } finally {
            setCompanyLoading(false);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Email is required' });
            return;
        }
        setLoading(true);
        try {
            const response = await apiClient.post('/accounts/company/invite', { email: email.trim() });
            setMessage({ type: 'success', text: response.data?.message || 'Invite sent successfully!' });
            setEmail('');
            await fetchCompany();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string }; status?: number } };
            const errorText = error.response?.data?.error || `Request failed (${error.response?.status || 'unknown'})`;
            setMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async (inviteId: string) => {
        setResendingId(inviteId);
        setMessage(null);
        try {
            const response = await apiClient.post(`/accounts/company/invite/resend?inviteId=${inviteId}`);
            setMessage({ type: 'success', text: response.data?.message || 'Invite resent successfully' });
            await fetchCompany();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string }; status?: number } };
            const errorText = error.response?.data?.error || `Failed to resend (${error.response?.status || 'unknown'})`;
            setMessage({ type: 'error', text: errorText });
        } finally {
            setResendingId(null);
        }
    };

    const handleRevoke = async (inviteId: string) => {
        setRevokingId(inviteId);
        setMessage(null);
        try {
            const response = await apiClient.post(`/accounts/company/invite/revoke?inviteId=${inviteId}`);
            setMessage({ type: 'success', text: response.data?.message || 'Invite revoked successfully' });
            await fetchCompany();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string }; status?: number } };
            const errorText = error.response?.data?.error || `Failed to revoke (${error.response?.status || 'unknown'})`;
            setMessage({ type: 'error', text: errorText });
        } finally {
            setRevokingId(null);
        }
    };

    return (
        <ViewLayout title="Invite Test (dev only)">
            <div className="invite-test-container">
                <p className="invite-test-description">
                    Quick test for POST /accounts/company/invite. Requires team admin.
                </p>
                <form onSubmit={handleSubmit} className="invite-test-form">
                    <div className="invite-test-input-wrapper">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email to invite"
                            disabled={loading}
                            className="invite-test-input"
                        />
                        <SaysoButton
                            label="Send Invite"
                            onClick={() => {}}
                            type="submit"
                            loading={loading}
                            disabled={loading}
                        />
                    </div>
                </form>
                {message && (
                    <div className={`invite-test-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <section className="invite-test-invites">
                    <h3 className="invite-test-invites-title">Pending & recent invites</h3>
                    {companyLoading ? (
                        <p className="invite-test-invites-loading">Loading invites…</p>
                    ) : invites === null || invites.length === 0 ? (
                        <p className="invite-test-invites-empty">No invites (or not a team admin)</p>
                    ) : (
                        <ul className="invite-test-invites-list">
                            {invites.map((inv) => (
                                <li key={inv.id} className="invite-test-invite-item">
                                    <div className="invite-test-invite-info">
                                        <span className="invite-test-invite-email">{inv.email}</span>
                                        <span className={`invite-test-invite-status invite-test-invite-status--${inv.status}`}>
                                            {inv.status}
                                        </span>
                                        {inv.expires_at && (
                                            <span className="invite-test-invite-expires">
                                                expires {new Date(inv.expires_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="invite-test-invite-actions">
                                        {inv.status === 'pending' && (
                                            <SaysoButton
                                                label="Revoke"
                                                onClick={() => handleRevoke(inv.id)}
                                                loading={revokingId === inv.id}
                                                disabled={!!revokingId || !!resendingId}
                                            />
                                        )}
                                        {(inv.status === 'revoked' || inv.status === 'expired') && (
                                            <SaysoButton
                                                label="Resend"
                                                onClick={() => handleResend(inv.id)}
                                                loading={resendingId === inv.id}
                                                disabled={!!resendingId || !!revokingId}
                                            />
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </ViewLayout>
    );
}
