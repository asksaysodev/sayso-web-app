import apiClient from "@/config/axios";
import { MarketplaceFeature } from "../types";


export default async function getFeatures(): Promise<MarketplaceFeature[]> {
    const res = await apiClient.get('features/');
    
    if (!res?.data) {
        throw new Error('Error getting Features')
    }
    
    return res.data;
}