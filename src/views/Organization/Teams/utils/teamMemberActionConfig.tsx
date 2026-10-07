import { ArrowLeftRight, RefreshCw, Trash2 } from 'lucide-react';
import type { RowActionConfig } from '@/views/Organization/shared/types';
import type { TeamMemberAction } from '../types';

export const TEAM_MEMBER_ACTION_CONFIG: Record<TeamMemberAction, RowActionConfig> = {
    updateRole: { label: 'Update member role', icon: <RefreshCw size={20} /> },
    transferMember: { label: 'Transfer member', icon: <ArrowLeftRight size={20} /> },
    removeFromTeam: { label: 'Remove from team', icon: <Trash2 size={20} />, destructive: true },
};
