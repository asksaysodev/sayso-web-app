export type WorkshopStatus = 'draft' | 'ready';

export type WorkshopEmail = 'announce' | 'reminder_a' | 'reminder_b' | 'next_week' | 'day_before' | 'today';

export interface AdminWorkshop {
    id: string;
    date: string;
    title: string;
    hook: string;
    description: string;
    takeaways: string[];
    host: string;
    imageUrl: string;
    meetUrl: string;
    status: WorkshopStatus;
    locked: boolean;
}

export type WorkshopInput = Omit<AdminWorkshop, 'id' | 'locked'>;
