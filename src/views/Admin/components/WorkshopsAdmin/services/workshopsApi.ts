import apiClient from '@/config/axios';
import { AdminWorkshop, WorkshopEmail, WorkshopInput, WorkshopStatus } from '../types';

interface WorkshopResponse {
    id: string;
    workshop_date: string;
    title: string;
    hook: string;
    description: string;
    takeaways: string[];
    host: string | null;
    image_url: string | null;
    meet_url: string;
    status: WorkshopStatus;
    locked: boolean;
}

function toWorkshop(row: WorkshopResponse): AdminWorkshop {
    return {
        id: row.id,
        date: row.workshop_date,
        title: row.title,
        hook: row.hook,
        description: row.description,
        takeaways: row.takeaways,
        host: row.host ?? '',
        imageUrl: row.image_url ?? '',
        meetUrl: row.meet_url,
        status: row.status,
        locked: row.locked,
    };
}

function toPayload(input: WorkshopInput) {
    return {
        workshop_date: input.date,
        title: input.title,
        hook: input.hook,
        description: input.description,
        takeaways: input.takeaways,
        host: input.host,
        image_url: input.imageUrl,
        meet_url: input.meetUrl,
        status: input.status,
    };
}

export async function getWorkshops(): Promise<AdminWorkshop[]> {
    const response = await apiClient.get('/admin/workshops');
    const rows: WorkshopResponse[] | undefined = response?.data;
    if (!Array.isArray(rows)) throw new Error('Failed to fetch workshops: unexpected response shape');
    return rows.map(toWorkshop);
}

export async function createWorkshop(input: WorkshopInput): Promise<AdminWorkshop> {
    const response = await apiClient.post('/admin/workshops', toPayload(input));
    return toWorkshop(response.data);
}

export async function updateWorkshop(id: string, input: WorkshopInput): Promise<AdminWorkshop> {
    const response = await apiClient.patch(`/admin/workshops/${id}`, toPayload(input));
    return toWorkshop(response.data);
}

export async function sendWorkshopTest(id: string, variant: WorkshopEmail): Promise<{ to: string }> {
    const response = await apiClient.post(`/admin/workshops/${id}/test`, { variant });
    return response.data;
}
