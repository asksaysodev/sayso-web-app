import { useState } from "react";
import ViewLayout from "@/components/layouts/ViewLayout";
import "./styles.css";
import InformativeCardsContainer from "./components/InformativeCardsContainer";
import ViewLayoutRefreshButton from "@/components/layouts/components/ViewLayoutRefreshButton";
import useRefreshDashboardData from "./hooks/useRefreshDashboardData";
import useIsTeamAdmin from "@/hooks/useIsTeamAdmin";
import Conversations from "./components/Conversations";
import DashboardFilters from "./components/Filters/DashboardFilters";
import FiltersButton from "./components/Filters/FiltersButton";

export default function Dashboard() {
    const { refreshDashboardData } = useRefreshDashboardData();
    const isAdmin = useIsTeamAdmin();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    return (
        <ViewLayout
            title='My Dashboard'
            scrollable
            right={
                <>
                    <ViewLayoutRefreshButton onClick={refreshDashboardData}/>
                    {isAdmin && <FiltersButton onClick={() => setIsFiltersOpen(true)}/>}
                </>
            }
        >
            {isAdmin && <DashboardFilters open={isFiltersOpen} onOpenChange={setIsFiltersOpen}/>}
            <InformativeCardsContainer />
            <Conversations />
        </ViewLayout>
    )
}
