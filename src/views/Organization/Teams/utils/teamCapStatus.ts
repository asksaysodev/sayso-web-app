import type { TeamStatus } from '@/views/Organization/shared/types';
import capPercent from './capPercent';

/**
 * Mirrors the server's `getTeamCapStatus` for an unsaved cap preview; saved teams use the
 * server's `status` instead. A cap without a threshold is never "approaching".
 */
export default function teamCapStatus(usedMinutes: number, hourCap: number | null, notifyAtPercent: number | null): TeamStatus {
    if (hourCap === null) return 'no_cap';

    const percent = capPercent(usedMinutes, hourCap);
    if (percent >= 100) return 'over';
    if (notifyAtPercent !== null && percent >= notifyAtPercent) return 'approaching';

    return 'on_track';
}
