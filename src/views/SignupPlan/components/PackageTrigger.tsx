import { forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

import formatMinutesToHours from '@/utils/formatters/formatMinutesToHours';
import formatPrice from '@/utils/formatters/formatPrice';
import type { PricingOption } from '@/views/Subscription/types';

interface Props {
    selected: PricingOption | null;
    /** Final price of the selected package (discount applied). */
    selectedPrice: number;
    open: boolean;
    onOpen: () => void;
}

/** Full-width "Select your package" control that replaces the hours chip on team cards. */
const PackageTrigger = forwardRef<HTMLButtonElement, Props>(function PackageTrigger(
    { selected, selectedPrice, open, onOpen },
    ref,
) {
    return (
        <button
            ref={ref}
            type="button"
            className={clsx('signupPlanPkgTrigger', selected && 'signupPlanPkgTrigger--selected')}
            aria-label={selected ? undefined : 'Select your package: team size & hours'}
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={onOpen}
        >
            <span className="signupPlanPkgValue">
                {selected
                    ? `${formatMinutesToHours(selected.includedMinutesPerMonth)} hrs / month`
                    : 'Select your package'}
            </span>
            {selected && <span className="signupPlanPkgTriggerPrice">${formatPrice(selectedPrice)}</span>}
            <ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
    );
});

export default PackageTrigger;
