import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LuX } from "react-icons/lu";
import SaysoLoader from "../../components/SaysoLoader";
import SaysoButton from "../../components/SaysoButton";
import "./styles.css";

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(6);

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
            <div className="checkout-page">
                <SaysoLoader />
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-card">
                <div className="checkout-icon-wrapper">
                    <LuX size={36} />
                </div>
                <h2 className="checkout-title">Payment Canceled</h2>
                <p className="checkout-description">Your payment was canceled. No charges were made.</p>
                <p className="checkout-redirect-text">Redirecting to Dashboard in {seconds} seconds...</p>
                <SaysoButton label="Go to Dashboard" onClick={handleGoBack} variant="outlined" fullWidth />
            </div>
        </div>
    );
}
