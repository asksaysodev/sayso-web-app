import ViewLayout from "@/components/layouts/ViewLayout";
import "./styles.css";
import InformativeCardsContainer from "./components/InformativeCardsContainer";
import InsightsContainer from "./components/InsightsContainer";

export default function Dashboard() {
  return (
		<ViewLayout title='My Dashboard' scrollable>
			<InformativeCardsContainer />
			<InsightsContainer />
		</ViewLayout>
  	)
}