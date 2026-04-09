import ViewLayout from "@/components/layouts/ViewLayout";
import "./styles.css";
import InformativeCardsContainer from "./components/InformativeCardsContainer";
import InsightsContainer from "./components/InsightsContainer";
import ViewLayoutRefreshButton from "@/components/layouts/components/ViewLayoutRefreshButton";
import useRefreshDashboardData from "./hooks/useRefreshDashboardData";
import NotificationWidget from "@/components/NotificationWidget";

export default function Dashboard() {
    const { refreshDashboardData } = useRefreshDashboardData();
    
    return (
		<>
    		<ViewLayout
    	        title='My Dashboard' 
    			scrollable 
    			right={<ViewLayoutRefreshButton 
    			onClick={refreshDashboardData}/>}
    		>
    			<InformativeCardsContainer />
    			<InsightsContainer />
    		</ViewLayout>
		    <NotificationWidget />
		</>
  	)
}