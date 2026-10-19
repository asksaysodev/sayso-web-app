import './ModalError.css';

interface Props {
    message: string | null;
}

/** Inline error inside a modal body. */
export default function ModalError({ message }: Props) {
    if (!message) return null;
    return (
        <p className='org-modal-error' role='alert'>
            {message}
        </p>
    );
}
