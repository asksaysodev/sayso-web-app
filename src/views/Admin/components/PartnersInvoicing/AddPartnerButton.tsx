import { Building2 } from 'lucide-react';
import SaysoDialog from '@/components/SaysoDialog';
import AddPartnerForm from './components/AddPartnerForm/AddPartnerForm';

export default function AddPartnerButton() {
    return (
        <SaysoDialog triggerLabel="Add Partner" triggerIcon={<Building2 size={16} />}>
            {({ close }) => <AddPartnerForm onClose={close} />}
        </SaysoDialog>
    );
}
