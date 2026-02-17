import { Dispatch, SetStateAction } from 'react';
import TabSelector from '../../../components/TabSelector';
import '../../../components/TabSelector.css';
import { BillingInterval, BillingIntervalEnum } from '../types';

const BillingTabOptions = [
	{ value: BillingIntervalEnum.MONTH, label: 'Monthly billing' },
	{ value: BillingIntervalEnum.YEAR, label: 'Annual billing' },
]

interface Props {
    selectedBillingTab: BillingInterval;
    setSelectedBillingTab: Dispatch<SetStateAction<BillingInterval>>;
}

export default function BillingTabSelector({ selectedBillingTab, setSelectedBillingTab }: Props) {
	return (
		<div className="billing-tab-selector-container">
			<TabSelector 
				tabs={BillingTabOptions}
				selectedValue={selectedBillingTab}
				onChange={(value: string) => setSelectedBillingTab(value as BillingInterval)}
			/>
		</div>
	)
}