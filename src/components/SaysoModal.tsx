import SaysoButton from './SaysoButton';
import '../styles/SaysoModal.css';

interface Props {
    title: string;
    text: string;
    isDelete?: boolean;
    isLoading?: boolean;
    onDeny: () => void;
    onConfirm: () => void;
    primaryText: string;
    secondaryText: string;
}

export default function SaysoModal({ title, text, isDelete = false, isLoading = false, onDeny, onConfirm, primaryText, secondaryText }: Props) {
    return (
        <div className="sayso-modal-view-container">
            <div className="sayso-modal-container">
                <h2>{title}</h2>
                <p>{text}</p>
                <div className="sayso-modal-actions">
                    <SaysoButton
                        label={secondaryText}
                        onClick={onDeny}
                        disabled={isLoading}
                        variant="outlined"
                    />
                    <SaysoButton
                        label={primaryText}
                        onClick={onConfirm}
                        loading={isLoading}
                        variant={isDelete ? 'error' : 'sayso-indigo'}
                    />
                </div>
            </div>
        </div>
    );
}