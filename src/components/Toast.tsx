import { useState, useEffect, type MouseEvent } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ds/Button';

import successIcon from '/assets/toast-success.svg';
import errorIcon from '/assets/toast-error.svg';
import warningIcon from '/assets/toast-warning.svg';

import '../styles/Toast.css';

export type ToastStatus = 'success' | 'error' | 'warning';

export interface ToastAction {
    label: string;
    onClick?: () => void;
}

export interface ToastOptions {
    description?: string;
    confirm?: ToastAction & { onClick: () => void };
    // `cancel` is not meant to be the same as `onClose` prop
    cancel?: ToastAction;
}

interface Props extends ToastOptions {
    status: ToastStatus;
    text: string;
    onClose: () => void;
    autoClose?: boolean;
}

const STATUS_ICON: Record<ToastStatus, string> = {
    success: successIcon,
    error: errorIcon,
    warning: warningIcon,
};

export default function Toast({ status, text, description, confirm, cancel, onClose, autoClose = false }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const hasActions = Boolean(confirm || cancel);
    const isDetailed = hasActions || Boolean(description);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        return () => clearTimeout(timer);
    }, []);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (autoClose) {
            setIsClosing(true);
            setTimeout(() => {
                onClose();
            }, 300);
        }
    }, [autoClose, onClose]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleAction = (action: ToastAction) => (event: MouseEvent) => {
        event.stopPropagation();
        action.onClick?.();
        handleClose();
    };

    const handleCloseClick = (event: MouseEvent) => {
        event.stopPropagation();
        handleClose();
    };

    return (
        <div
            className={`toast toast--${status} ${isDetailed ? 'toast--detailed' : ''} ${hasActions ? 'toast--actionable' : ''} ${isVisible ? 'is-visible' : ''} ${isClosing ? 'is-closing' : ''}`}
            role={status === 'error' ? 'alert' : 'status'}
            onClick={hasActions ? undefined : handleClose}
        >
            <div className="toast-content">
                <div className="toast-main">
                    <img className="toast-icon" src={STATUS_ICON[status]} alt="" width={24} height={24} />
                    <div className="toast-text-content">
                        <span className="toast-text">{text}</span>
                        {description && <span className="toast-description">{description}</span>}
                    </div>
                </div>
                {hasActions && (
                    <div className="toast-actions">
                        {confirm && (
                            <Button size="sm" variant="primary" onClick={handleAction(confirm)}>
                                {confirm.label}
                            </Button>
                        )}
                        {cancel && (
                            <Button size="sm" variant="secondary" onClick={handleAction(cancel)}>
                                {cancel.label}
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <button type="button" className="toast-close" aria-label="Dismiss notification" onClick={handleCloseClick}>
                <X size={16} strokeWidth={1.5} />
            </button>
        </div>
    );
}
