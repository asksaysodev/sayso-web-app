interface Props {
    perks: string[];
}

export default function PlanPerks({ perks }: Props) {
    return (
        <section className="signupPlanDetailsSection signupPlanDetailsSection--divided">
            <h3 className="signupPlanDetailsHeading">Also included</h3>
            <p className="signupPlanPerks">{perks.join(' · ')}</p>
        </section>
    );
}
