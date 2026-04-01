import apiClient from "@/config/axios";

interface TipBody {
    type: 'paragraph';
    text: string
}

interface Tip {
    "title": string,
    "body": TipBody[]
}

interface CoachTips {
    tips: Tip[];
    custom: boolean;
}

export default async function getCoachTips(): Promise<CoachTips> {
    const response = await apiClient.get('/tips');

    if (!response?.data) {
        throw new Error('Failed to fetch coach tips');
    }

    return response?.data
}