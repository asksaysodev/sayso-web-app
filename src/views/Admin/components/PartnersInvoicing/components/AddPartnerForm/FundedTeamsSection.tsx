import { Control, FieldArrayWithId } from 'react-hook-form';
import { Plus } from 'lucide-react';
import TeamRow from './TeamRow';
import RunningTotal from './RunningTotal';
import PlansLoadError from './PlansLoadError';
import type { AddPartnerFormValues, TeamPlanOption } from './types';
import './styles/FundedTeamsSection.css';

interface Props {
    control: Control<AddPartnerFormValues>;
    fields: FieldArrayWithId<AddPartnerFormValues, 'teams'>[];
    onAppend: () => void;
    onRemove: (index: number) => void;
    plans: TeamPlanOption[];
    watchedTeams: Array<{ email: string; planOptionId: string }>;
    netTerms: string;
    plansLoading: boolean;
    plansError: boolean;
    plansRetrying: boolean;
    onRetryPlans: () => void;
}

export default function FundedTeamsSection({
    control,
    fields,
    onAppend,
    onRemove,
    plans,
    watchedTeams,
    netTerms,
    plansLoading,
    plansError,
    plansRetrying,
    onRetryPlans,
}: Props) {
    const plansUnavailable = plansLoading || plansError;
    const planPlaceholder = plansLoading
        ? 'Loading plans…'
        : plansError
            ? 'Plans unavailable'
            : 'Select plan';

    return (
        <div className="funded-teams-section">
            <div className="funded-teams-section__header">
                <span className="funded-teams-section__label">Funded teams</span>
                <span className="funded-teams-section__count">
                    {fields.length} {fields.length === 1 ? 'team' : 'teams'}
                </span>
            </div>
            {plansError && <PlansLoadError onRetry={onRetryPlans} isRetrying={plansRetrying} />}
            <div className="funded-teams-section__rows">
                {fields.map((field, index) => (
                    <TeamRow
                        key={field.id}
                        control={control}
                        index={index}
                        plans={plans}
                        onRemove={() => onRemove(index)}
                        canRemove={fields.length > 1}
                        planDisabled={plansUnavailable}
                        planPlaceholder={planPlaceholder}
                    />
                ))}
            </div>
            <button type="button" className="funded-teams-section__add" onClick={onAppend} disabled={plansUnavailable}>
                <Plus size={14} />
                <span>Add team</span>
            </button>
            <RunningTotal plans={plans} watchedTeams={watchedTeams} netTerms={netTerms} />
        </div>
    );
}
