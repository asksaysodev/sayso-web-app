import { RefreshCw, Send, Trash2 } from 'lucide-react';
import type { MemberRowAction } from '../types';
import type { RowActionConfig } from '@/views/Organization/shared/types';

export const ROW_ACTION_CONFIG: Record<MemberRowAction, RowActionConfig> = {
    updateRole: { label: 'Update role member', icon: <RefreshCw size={20} /> },
    resendInvite: { label: 'Resend invite', icon: <Send size={20} /> },
    removeMember: { label: 'Remove member', icon: <Trash2 size={20} />, destructive: true },
    revokeInvite: { label: 'Revoke invite', icon: <Trash2 size={20} />, destructive: true },
};
