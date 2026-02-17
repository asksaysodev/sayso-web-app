import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SaysoLoader from "../../components/SaysoLoader";
import "./styles.css";

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [success, setSuccess] = useState<boolean | null>(null);
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        const successParam = searchParams.get("success");
        if (successParam === "true") {
            setSuccess(true);
        } else if (successParam === "false") {
            setSuccess(false);
        }
    }, [searchParams]);

    useEffect(() => {
        if (success !== null && seconds > 0) {
            const timer = setTimeout(() => {
                setSeconds(seconds - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (success !== null && seconds === 0) {
            navigate("/");
        }
    }, [success, seconds, navigate]);

    const handleGoBack = () => {
        navigate("/");
    };

    if (success === null) {
        return (
            <div className="checkout-panel-main">
                <SaysoLoader />
            </div>
        );
    }

    return (
        <div className="checkout-panel-main">
            <div className={`checkout-panel-content ${success ? 'success' : 'canceled'}`}>
                {success ? (
                    <div className="checkout-success">
                        <h2>Payment Successful!</h2>
                        <p>Thank you for your subscription. Your account has been upgraded.</p>
                    </div>
                ) : (
                    <div className="checkout-canceled">
                        <h2>Payment Canceled</h2>
                        <p>Your payment was canceled. No charges were made.</p>
                    </div>
                )}
                <p className="checkout-panel-redirect-text">Redirecting to Dashboard in {seconds} seconds...</p>
            </div>
            <div className="checkout-panel-footer">
                <button className="checkout-panel-footer-button" onClick={handleGoBack}>Go to Dashboard</button>
            </div>
        </div>
    );
}
