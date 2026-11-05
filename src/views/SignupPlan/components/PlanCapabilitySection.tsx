import type { PlanDetailsRow } from '../constants/planDetails';

import PlanCapabilityRow from './PlanCapabilityRow';

interface Props {
    title: string;
    rows: PlanDetailsRow[];
    divided?: boolean;
}

export default function PlanCapabilitySection({ title, rows, divided = false }: Props) {
    return (
        <section className={divided ? 'signupPlanDetailsSection signupPlanDetailsSection--divided' : 'signupPlanDetailsSection'}>
            <h3 className="signupPlanDetailsHeading">{title}</h3>
            <ul className="signupPlanCapabilities">
                {rows.map((row) => <PlanCapabilityRow key={row.name} row={row} />)}
            </ul>
        </section>
    );
}
