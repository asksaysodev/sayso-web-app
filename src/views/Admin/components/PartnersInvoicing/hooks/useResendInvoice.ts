import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resendPartnerInvoice } from '../services/resendPartnerInvoice';
import reportApiError from '@/utils/reportApiError';
import { useToast } from '@/context/ToastContext';

export type ResendState = 'idle' | 'sending' | 'sent';

export function useResendInvoice(partnerId: string) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const [sentId, setSentId] = useState<string | null>(null);

    const { mutate, isPending, variables } = useMutation({
        mutationFn: (invoiceId: string) => resendPartnerInvoice(partnerId, invoiceId),
        onSuccess: (_data, invoiceId) => {
            queryClient.invalidateQueries({ queryKey: ['admin-partner-invoices', partnerId] });
            setSentId(invoiceId);
            showToast('success', 'Invoice resent to the partner.');
            setTimeout(() => setSentId(current => (current === invoiceId ? null : current)), 2200);
        },
        onError: (error) => {
            reportApiError(error, { feature: 'admin-partner-invoices', operation: 'resendPartnerInvoice' });
            const message = axios.isAxiosError(error)
                ? (error.response?.data?.error ?? 'Failed to resend invoice')
                : 'Failed to resend invoice';
            showToast('error', message);
        },
    });

    const resendState = (invoiceId: string): ResendState => {
        if (isPending && variables === invoiceId) return 'sending';
        if (sentId === invoiceId) return 'sent';
        return 'idle';
    };

    return { resend: mutate, resendState };
}
