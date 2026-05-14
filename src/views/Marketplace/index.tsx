import ViewLayout from "@/components/layouts/ViewLayout";
import { useQuery } from "@tanstack/react-query";
import getFeatures from "./services/getFeatures";
import { useMemo } from "react";
import MarketplaceSkeleton from "./components/MarketplaceSkeleton";
import MarketplaceError from "./components/MarketplaceError";
import './styles.css';

export default function Marketplace() {
    const { data, isLoading,isError, refetch } = useQuery({
        queryKey: ['get-features'],
        queryFn: getFeatures
    })
    
    const sortedByOrderStatus = useMemo(() => {
        return data?.slice().sort((a, b) => a.sort_order - b.sort_order)
    }, [data])
    
    return (
        <ViewLayout 
            title="Marketplace"
            description="Explore and manage the features powering your Sayso experience."
        >
            {isLoading && <MarketplaceSkeleton />}
            {isError && <MarketplaceError onRetry={refetch} />}
            {!isLoading && !isError && (
                <div className="marketplace-grid">
                    {sortedByOrderStatus?.map(({ id, description, display_name, subtitle, status }) => (
                        <div key={id} className="marketplace-card">
                            <span className="marketplace-card-subtitle">{subtitle}</span>
                            <span className="marketplace-card-display-name">{display_name}</span>
                            <span className="marketplace-card-description">{description}</span>
                            <span className={`marketplace-card-status marketplace-card-status-${status}`}>{status}</span>
                        </div>
                    ))}
                </div>
            )}
        </ViewLayout>
    )
}