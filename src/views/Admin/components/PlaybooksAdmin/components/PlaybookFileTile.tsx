import clsx from 'clsx';
import { getFileExtension } from '../utils/playbookFile';
import '../styles/PlaybookFileTile.css';

interface Props {
    fileName: string;
}

export default function PlaybookFileTile({ fileName }: Props) {
    const extension = getFileExtension(fileName);

    return (
        <span className={clsx('playbook-file-tile', `playbook-file-tile--${extension}`)} aria-hidden='true'>
            {extension.toUpperCase()}
        </span>
    );
}
