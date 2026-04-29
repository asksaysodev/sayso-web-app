import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LuX } from "react-icons/lu";
import SaysoLoader from "../../components/SaysoLoader";
import SaysoButton from "../../components/SaysoButton";
import "./styles.css";

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const successParam = searchParams.get("success");
    const success = successParam === null ? null : successParam === "true";

    useEffect(() => {
        if (success === null) {
            navigate("/", { replace: true });
        } else if (success === true) {
            navigate("/download", { replace: true });
        }
    }, [success, navigate]);

    if (success !== false) {
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
                <SaysoButton label="View Plans" onClick={() => navigate("/subscription")} variant="outlined" fullWidth />
            </div>
        </div>
    );
}
