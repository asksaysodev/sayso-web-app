export interface PlanDetailsRow {
    name: string;
    description?: string;
}

export interface PlanDetailsConfig {
    /** "What you can do" rows. */
    capabilities: PlanDetailsRow[];
    /** "For your team" rows; omitted on individual plans. */
    teamRows?: PlanDetailsRow[];
    /** "Also included" items; empty hides the section. */
    perks: string[];
}

const CAPABILITIES: PlanDetailsRow[] = [
    { name: 'Cue', description: 'Live coaching on screen while you talk, so you always know what to say next.' },
    { name: 'Pulse', description: 'Local market data mid-call: prices, days on market, inventory.' },
    { name: 'Composer', description: 'Generates custom scripts built on proven sales frameworks.' },
    { name: 'Smart Capture', description: 'Writes your call notes and syncs them to your CRM.' },
    { name: 'Playbooks', description: 'Your own scripts on screen, right next to Cue.' },
    { name: 'Dashboard analytics', description: 'Track your performance on every call.' },
];

/** Plan details copy for new-generation purchasable plans, keyed by account type. */
export const PLAN_DETAILS: Record<'individual' | 'team', PlanDetailsConfig> = {
    individual: {
        capabilities: CAPABILITIES,
        perks: ['1-on-1 onboarding', 'Weekly group coaching call', 'Ranked Agent Referral Network', 'Email support'],
    },
    team: {
        capabilities: CAPABILITIES.filter((row) => row.name !== 'Dashboard analytics'),
        teamRows: [
            { name: 'Leadership dashboard', description: "See every team's performance in one place, unlimited teams." },
            { name: 'Conversion benchmarking', description: 'Compare reps and teams against each other.' },
            { name: 'Custom implementation', description: 'We set it up for your team and train your trainers.' },
            { name: 'Dedicated CSM', description: 'One person who knows your account.' },
            { name: 'Priority support', description: 'Faster answers when something blocks you.' },
        ],
        perks: ['Weekly group coaching call', 'Ranked Agent Referral Network'],
    },
};
