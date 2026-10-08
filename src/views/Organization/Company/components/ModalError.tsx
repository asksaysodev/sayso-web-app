import './ModalError.css';

interface Props {
    message: string | null;
}

/** Inline error inside a modal body. */
export default function ModalError({ message }: Props) {
    if (!message) return null;
    return (
        <p className='company-modal-error' role='alert'>
            {message}
        </p>
    );
}
