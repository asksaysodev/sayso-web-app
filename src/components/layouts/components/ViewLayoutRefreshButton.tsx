import { RefreshCcw } from "lucide-react";

interface Props {
    onClick: () => void;
}

export default function ViewLayoutRefreshButton({ onClick }: Props) {
    return (
        <div className="view-layout-refresh-button" onClick={onClick}>
            <RefreshCcw size={18}/>
        </div>
    )
}