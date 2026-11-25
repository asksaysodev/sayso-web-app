import type { ReactNode } from 'react';
import StepHeading from '../RetentionFlow/StepHeading';
import StepLayout from '../RetentionFlow/StepLayout';
import SummaryRows, { type SummaryRow } from '../RetentionFlow/SummaryRows';

interface Props {
    title: string;
    description: string;
    rows: SummaryRow[];
    footer: ReactNode;
    /** Notice and anything else below the summary. */
    children: ReactNode;
}

export default function StateActionLayout({ title, description, rows, footer, children }: Props) {
    return (
        <StepLayout isCompact footer={footer}>
            <StepHeading title={title} description={description} />
            {rows.length > 0 && <SummaryRows isBoxed rows={rows} />}
            {children}
        </StepLayout>
    );
}
