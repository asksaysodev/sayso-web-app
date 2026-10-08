import '../styles/PlaybooksProcessingNote.css';

interface Props {
    count: number;
}

export default function PlaybooksProcessingNote({ count }: Props) {
    return (
        <p className='playbooks-processing-note' role='status'>
            <span className='playbooks-processing-note__spinner' aria-hidden='true' />
            {count === 1 ? '1 playbook is processing.' : `${count} playbooks are processing.`} This list refreshes automatically.
        </p>
    );
}
