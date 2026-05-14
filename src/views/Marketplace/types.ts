export interface MarketplaceFeature {
    created_at: string;
    description: string;
    display_name: string;
    id: string;
    key: string;
    sort_order: number;
    status: "live" | "beta";
    subtitle: string;
}