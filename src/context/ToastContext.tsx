import { createContext, useContext, useState, useRef } from 'react';
import Toast, { type ToastOptions, type ToastStatus } from '../components/Toast';

export interface Toast extends ToastOptions {
  status: ToastStatus;
  text: string;
  autoClose?: boolean;
}

interface ToastContextValue {
  showToast: (status: ToastStatus, text: string, options?: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue>({} as ToastContextValue)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {

    const [toast, setToast] = useState<Toast | null>(null);
    const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = (status: ToastStatus, text: string, options: ToastOptions = {}): void => {
        // Clear any existing timeout
        if (autoHideTimeoutRef.current) {
            clearTimeout(autoHideTimeoutRef.current);
        }
        
        setToast({ status, text, ...options });

        if (options.confirm || options.cancel) {
            autoHideTimeoutRef.current = null;
            return;
        }

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
                    description={toast.description}
                    confirm={toast.confirm}
                    cancel={toast.cancel}
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