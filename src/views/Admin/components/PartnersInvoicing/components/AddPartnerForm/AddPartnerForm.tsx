import { useAddPartnerForm } from './hooks/useAddPartnerForm';
import { useTeamPlans } from './hooks/useTeamPlans';
import ControlledInputField from '@/components/forms/ControlledInputField';
import ControlledSelectField from '@/components/forms/ControlledSelectField';
import FormHeader from './FormHeader';
import FundedTeamsSection from './FundedTeamsSection';
import FormFooter from './FormFooter';
import AddPartnerSuccess from './AddPartnerSuccess';
import './styles/AddPartnerForm.css';

interface Props {
    onClose: () => void;
}

const NET_TERMS_OPTIONS = [
    { value: '15', label: 'Net 15' },
    { value: '30', label: 'Net 30' },
    { value: '60', label: 'Net 60' },
];

export default function AddPartnerForm({ onClose }: Props) {
    const { plans, isLoading: plansLoading } = useTeamPlans();
    const {
        control,
        onSubmit,
        fields,
        append,
        remove,
        watchedTeams,
        watchedNetTerms,
        isPending,
        isSuccess,
        teamCount,
        errorMessage,
    } = useAddPartnerForm();

    if (isSuccess) {
        return (
            <div className="add-partner-form">
                <AddPartnerSuccess teamCount={teamCount} onClose={onClose} />
            </div>
        );
    }

    return (
        <form className="add-partner-form" onSubmit={onSubmit}>
            <FormHeader />
            <div className="add-partner-form__body">
                <ControlledInputField
                    name="partnerName"
                    control={control}
                    label="Partner name"
                    placeholder="e.g. Acme Corp"
                    isRequired
                    rules={{ required: 'Partner name is required' }}
                />
                <ControlledInputField
                    name="billingEmail"
                    control={control}
                    label="Billing email"
                    type="email"
                    placeholder="billing@company.com"
                    isRequired
                    rules={{
                        required: 'Billing email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                    }}
                />
                <ControlledSelectField
                    name="netTerms"
                    control={control}
                    label="Net terms"
                    isRequired
                    options={NET_TERMS_OPTIONS}
                />
                <FundedTeamsSection
                    control={control}
                    fields={fields}
                    onAppend={append}
                    onRemove={remove}
                    plans={plans}
                    watchedTeams={watchedTeams}
                    netTerms={watchedNetTerms}
                    plansLoading={plansLoading}
                />
            </div>
            {errorMessage && <p className="add-partner-form__error">{errorMessage}</p>}
            <FormFooter onCancel={onClose} isPending={isPending} />
        </form>
    );
}
