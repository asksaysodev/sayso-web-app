import { Control } from 'react-hook-form';
import { X } from 'lucide-react';
import ControlledInputField from '@/components/forms/ControlledInputField';
import ControlledSelectField from '@/components/forms/ControlledSelectField';
import type { AddPartnerFormValues, TeamPlanOption } from './types';
import './styles/TeamRow.css';

interface Props {
    control: Control<AddPartnerFormValues>;
    index: number;
    plans: TeamPlanOption[];
    onRemove: () => void;
    canRemove: boolean;
}

export default function TeamRow({ control, index, plans, onRemove, canRemove }: Props) {
    const planOptions = plans.map(({ id, label }) => ({ value: id, label }));

    return (
        <div className="team-row">
            <div className="team-row__fields">
                <ControlledInputField
                    name={`teams.${index}.email`}
                    control={control}
                    type="email"
                    placeholder="team@company.com"
                    rules={{
                        required: 'Team email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                    }}
                />
                <ControlledSelectField
                    name={`teams.${index}.planOptionId`}
                    control={control}
                    placeholder="Select plan"
                    options={planOptions}
                    rules={{ required: 'Select a plan' }}
                />
            </div>
            {canRemove && (
                <button type="button" className="team-row__remove" onClick={onRemove}>
                    <X size={15} />
                </button>
            )}
        </div>
    );
}
