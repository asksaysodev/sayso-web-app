import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SaysoLoader from "../../components/SaysoLoader";
import "./styles.css";

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(5);

    const successParam = searchParams.get("success");
    const success = successParam === null ? null : successParam === "true";

    useEffect(() => {
        if (success === true) {
            navigate("/?success=true", { replace: true });
            return;
        }
        if (success === false && seconds > 0) {
            const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
            return () => clearTimeout(timer);
        } else if (success === false && seconds === 0) {
            navigate("/", { replace: true });
        }
    }, [success, seconds, navigate]);

    const handleGoBack = () => navigate("/");

    if (success === null || success === true) {
        return (
            <div className="checkout-panel-main">
                <SaysoLoader />
            </div>
        );
    }

    return (
        <div className="checkout-panel-main">
            <div className="checkout-panel-content canceled">
                <div className="checkout-canceled">
                    <h2>Payment Canceled</h2>
                    <p>Your payment was canceled. No charges were made.</p>
                </div>
                <p className="checkout-panel-redirect-text">Redirecting to Dashboard in {seconds} seconds...</p>
            </div>
            <div className="checkout-panel-footer">
                <button className="checkout-panel-footer-button" onClick={handleGoBack}>Go to Dashboard</button>
            </div>
        </div>
    );
}
