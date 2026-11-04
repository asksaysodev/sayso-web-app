import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/ds/Modal';

import type { PlanDetailsConfig } from '../constants/planDetails';
import PlanCapabilitySection from './PlanCapabilitySection';
import PlanPerks from './PlanPerks';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    planName: string;
    priceLabel: string;
    details: PlanDetailsConfig;
    ctaLabel: string;
    ctaDisabled: boolean;
    ctaLoading: boolean;
    onCta: () => void;
}

/** Plan details driven by a per-plan config: capabilities, team rows, perks, and the plan card's CTA. */
export default function PlanDetailsModal({
    open,
    onOpenChange,
    planName,
    priceLabel,
    details,
    ctaLabel,
    ctaDisabled,
    ctaLoading,
    onCta,
}: Props) {
    const { capabilities, teamRows = [], perks } = details;

    return (
        <Modal className="signupPlanDetailsModal" open={open} onOpenChange={onOpenChange}>
            <ModalHeader align="start" title={planName} description={priceLabel} className="signupPlanDetailsHeader" />
            <ModalBody className="signupPlanDetailsBody">
                {capabilities.length > 0 && <PlanCapabilitySection title="What you can do" rows={capabilities} />}
                {teamRows.length > 0 && <PlanCapabilitySection title="For your team" rows={teamRows} divided />}
                {perks.length > 0 && <PlanPerks perks={perks} />}
            </ModalBody>
            <ModalFooter className="signupPlanDetailsFooter">
                <Button className="signupPlanDetailsCta" loading={ctaLoading} disabled={ctaDisabled} onClick={onCta}>
                    {ctaLabel}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
