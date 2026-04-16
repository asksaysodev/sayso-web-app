import { CreatedNotification } from "@/views/Admin/types";

export function getStatus(n: CreatedNotification): 'active' | 'paused' | 'expired' {
    if (n.expires_at && new Date(n.expires_at) < new Date()) return 'expired';
    if (!n.active) return 'paused';
    return 'active';
}