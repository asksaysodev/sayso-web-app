import SaysoModal from "@/components/SaysoModal";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import getActivePlan from "@/views/Subscription/services/getActivePlan";
import useHasSubscription from "@/hooks/useHasSubscription";

interface SubscriptionAlert {
    title: string;
    description: string;
    fn?: () => void;
}

interface SubscriptionAlertContextValue {
    showSubscriptionAlert: (title: string, description: string, fn?: () => void) => void;
    hideSubscriptionAlert: () => void;
}

const DEFAULT_SUBSCRIPTION_ALERT: SubscriptionAlert = {
    title: 'Upgrade to paid account',
    description: 'You are currently on a free trial and ran out of minutes. Upgrade to a paid account to continue using the Coach Feature.',
};

const SubscriptionAlertContext = createContext<SubscriptionAlertContextValue>({} as SubscriptionAlertContextValue);

export const SubscriptionAlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [subscriptionAlert, setSubscriptionAlert] = useState<SubscriptionAlert | null>(null);
    const navigate = useNavigate();
    const { globalUser } = useAuth();
    const hasSubscription = useHasSubscription();

    const { data: activePlan } = useQuery({
        queryKey: ['active-plan'],
        queryFn: getActivePlan,
        enabled: hasSubscription,
    });

    const isTrialing = useMemo(() => activePlan?.subscription?.status === 'trialing', [activePlan]);

    const isOutOfMinutes = useMemo(() =>
        (globalUser?.minutes_balance !== null && globalUser?.minutes_balance !== undefined) &&
        globalUser?.minutes_balance <= 0,
    [globalUser]);

    const showSubscriptionAlert = useCallback((title: string, description: string, fn?: () => void) => {
        if (!title && !description) return;
        setSubscriptionAlert({ title, description, fn });
    }, []);
    
    useEffect(() => {
        if (hasSubscription && isOutOfMinutes && isTrialing) {
            if (!sessionStorage.getItem('alreadyShownAlert')) {
                showSubscriptionAlert(DEFAULT_SUBSCRIPTION_ALERT.title, DEFAULT_SUBSCRIPTION_ALERT.description);
                sessionStorage.setItem('alreadyShownAlert', 'true');
            }
        }
    }, [isOutOfMinutes, isTrialing, showSubscriptionAlert, hasSubscription]);
    

    const hideSubscriptionAlert = () => {
        setSubscriptionAlert(null);
    };

    const handleConfirm = (fn?: () => void) => {
        if (fn) {
            fn();
        } else {
            navigate('/subscription');
        }
        hideSubscriptionAlert();
    };

    const values = {
        showSubscriptionAlert,
        hideSubscriptionAlert,
    };
    
    return (
        <SubscriptionAlertContext.Provider value={values}>
            {children}
            {subscriptionAlert !== null && (
                <SaysoModal
                    primaryText="Upgrade to paid account"
                    secondaryText="Cancel"
                    onDeny={hideSubscriptionAlert}
                    onConfirm={() => handleConfirm(subscriptionAlert.fn)}
                    title={subscriptionAlert.title}
                    text={subscriptionAlert.description}
                />
            )}
        </SubscriptionAlertContext.Provider>
    );
};

export const useSubscriptionAlert = () => {
    const context = useContext(SubscriptionAlertContext);
    if (!context) {
        throw new Error('useSubscriptionAlert must be used within a SubscriptionAlertProvider');
    }
    return context;
};