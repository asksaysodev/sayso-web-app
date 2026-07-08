import suresendIcon from '/assets/suresend-icon-color.svg';

export default function SureSendTile() {
    return (
        <div className="connection-tile connection-tile--suresend">
            <img src={suresendIcon} alt="SureSend" width={26} height={26} style={{ objectFit: 'contain' }} />
        </div>
    );
}
