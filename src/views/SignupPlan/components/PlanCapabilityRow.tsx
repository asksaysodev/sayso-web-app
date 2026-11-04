import type { PlanDetailsRow } from '../constants/planDetails';

interface Props {
    row: PlanDetailsRow;
}

export default function PlanCapabilityRow({ row }: Props) {
    return (
        <li className="signupPlanCapability">
            <span className="signupPlanCapabilityName">{row.name}</span>
            {row.description && <span className="signupPlanCapabilityDescription">{row.description}</span>}
        </li>
    );
}
