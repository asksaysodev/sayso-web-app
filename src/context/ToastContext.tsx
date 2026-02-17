import { createContext, useContext, useState, useRef } from 'react';
import Toast from '../components/Toast';

type ToastStatus = 'success' | 'error' | 'warning';

export interface Toast {
  status: ToastStatus;
  text: string;
  autoClose?: boolean;
}

interface ToastContextValue {
  showToast: (status: ToastStatus, text: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue>({} as ToastContextValue)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {

    const [toast, setToast] = useState<Toast | null>(null);
    const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = (status: ToastStatus, text: string): void => {
        // Clear any existing timeout
        if (autoHideTimeoutRef.current) {
            clearTimeout(autoHideTimeoutRef.current);
        }
        
        setToast({ status, text });
        
        autoHideTimeoutRef.current = setTimeout(() => {
            setToast(prev => prev ? { ...prev, autoClose: true } : null);
        }, 1500);
    };

    const hideToast = () => {
        if (autoHideTimeoutRef.current) {
            clearTimeout(autoHideTimeoutRef.current);
        }
        setToast(null);
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {toast && (
                <Toast 
                    status={toast.status} 
                    text={toast.text} 
                    onClose={hideToast}
                    autoClose={toast.autoClose}
                />
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};