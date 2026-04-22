import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import './DownloadDesktopAppButton.css';

export default function DownloadDesktopAppButton() {
    const navigate = useNavigate();

    return (
        <button
            className='download-for-mac-button'
            onClick={() => navigate('/download')}
        >
            <Download size={15} />
            Download for Mac
        </button>
    );
}
