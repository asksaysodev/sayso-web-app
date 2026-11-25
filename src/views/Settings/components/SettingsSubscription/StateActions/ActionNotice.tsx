import Notice from '../RetentionFlow/Notice';

interface Props {
    errorMessage: string | null;
    isPending: boolean;
    pendingMessage: string;
    message: string;
}

/** What happens next, what is happening, or what went wrong. */
export default function ActionNotice({ errorMessage, isPending, pendingMessage, message }: Props) {
    if (isPending) return <Notice tone='primary' role='status'>{pendingMessage}</Notice>;
    if (errorMessage) return <Notice tone='error' role='alert'>{errorMessage}</Notice>;
    return <Notice tone='primary'>{message}</Notice>;
}
