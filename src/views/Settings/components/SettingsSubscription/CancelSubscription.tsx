import './CancelSubscription.css';

interface Props {
    onClick: () => void;
}

export default function CancelSubscription({ onClick }: Props) {
    return (
        <button type='button' className='cancel-subscription' onClick={onClick}>
            I want to cancel
        </button>
    );
}
