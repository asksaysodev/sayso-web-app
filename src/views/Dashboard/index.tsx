import ViewLayout from "@/components/layouts/ViewLayout";
import "./styles.css";
import CTABar from "@/components/CTABar";
import InformativeCardsContainer from "./components/InformativeCardsContainer";
import InsightsContainer from "./components/InsightsContainer";
import RefreshWidgetsDataButton from "./components/RefreshWidgetsDataButton";

export default function Dashboard() {
  return (
		<ViewLayout title='My Dashboard' rightContent={<RefreshWidgetsDataButton />}>
			<CTABar active={false} />
			<InformativeCardsContainer />
			<InsightsContainer />
		</ViewLayout>
  	)
}