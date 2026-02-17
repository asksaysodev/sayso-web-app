import SaysoButton from "@/components/SaysoButton";

interface Props {
    onRetry: () => void;
}

export default function ActiveSubscriptionInformationError({ onRetry }: Props) {
    return (
        <div className="active-plan-information-container">
            <div className="subscription-section">
                <div className="subscription-error-container">
                    <p className="subscription-error-message">
                        Oops! An error occurred while loading billing data.
                    </p>
                    <SaysoButton
                        label="Reload"
                        onClick={onRetry}
                        variant="sayso-indigo"
                    />
                </div>
            </div>
        </div>
    );
}

