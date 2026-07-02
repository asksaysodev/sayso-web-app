import SaysoButton from '@/components/SaysoButton';
import './styles/FormFooter.css';

interface Props {
    onCancel: () => void;
    isPending: boolean;
}

export default function FormFooter({ onCancel, isPending }: Props) {
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
                loading={isPending}
                loadingLabel="Creating..."
            />
        </div>
    );
}
