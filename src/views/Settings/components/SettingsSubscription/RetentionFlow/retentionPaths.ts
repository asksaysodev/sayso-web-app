import type { StepProgress } from './StepHeading';

export type RetentionChoice = 'pause' | 'cancel';

export type RetentionStep =
    | 'choice'
    | 'pause'
    | 'pause-done'
    | 'reason'
    | 'offer'
    | 'offer-done'
    | 'confirm';

interface Path {
    choice: RetentionChoice;
    hasPause: boolean;
    hasDiscount: boolean;
}

const pathSteps = ({ choice, hasPause, hasDiscount }: Path): RetentionStep[] => {
    if (choice === 'pause') return ['choice', 'pause'];
    return [...(hasPause ? (['choice'] as const) : []), 'reason', ...(hasDiscount ? (['offer'] as const) : []), 'confirm'];
};

/** Position among the steps the user goes through on this path; `null` on confirmations. */
export const stepProgress = (step: RetentionStep, path: Path): StepProgress | null => {
    const steps = pathSteps(path);
    const index = steps.indexOf(step);
    return index === -1 ? null : { current: index + 1, total: steps.length };
};
