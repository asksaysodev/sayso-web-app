import SaysoButton from '@/components/SaysoButton';
import './styles/FormFooter.css';

interface Props {
    onCancel: () => void;
    isPending: boolean;
    canSubmit: boolean;
}

export default function FormFooter({ onCancel, isPending, canSubmit }: Props) {
    return (
        <div className="form-footer">
            <SaysoButton
                label="Cancel"
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={isPending}
            />
            <SaysoButton
                label="Create partner"
                type="submit"
                disabled={!canSubmit}
                loading={isPending}
                loadingLabel="Creating..."
            />
        </div>
    );
}
