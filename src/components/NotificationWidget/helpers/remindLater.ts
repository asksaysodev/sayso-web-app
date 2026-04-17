const REMIND_LATER_KEY = 'nw_reminded_ids';

export function getRemindedIds(): string[] {
    try {
        return JSON.parse(sessionStorage.getItem(REMIND_LATER_KEY) || '[]');
    } catch {
        return [];
    }
}

export function addRemindedId(id: string): string[] {
    const ids = getRemindedIds();
    const updated = [...ids, id];
    sessionStorage.setItem(REMIND_LATER_KEY, JSON.stringify(updated));
    return updated;
}
