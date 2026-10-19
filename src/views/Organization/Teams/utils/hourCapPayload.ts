import { NOTIFY_AT_PERCENT } from '../constants';

/**
 * Cap fields for `POST` / `PATCH /teams`. There is no "warn at" field in the design: every cap
 * goes out with the Figma rule's 80% threshold, and clearing the cap clears it too.
 */
export default function hourCapPayload(hourCap: number | null) {
    return {
        hour_cap: hourCap,
        notify_at_percent: hourCap === null ? null : NOTIFY_AT_PERCENT,
    };
}
