export interface LpmamaField {
    key: string;
    letter: string;
    label: string;
    color: string;
}

// Order + colors match the desktop Electron app (client/src/coachWindow/constants/lpmama.ts)
export const LPMAMA_CONFIG: LpmamaField[] = [
    { key: 'location',    letter: 'L', label: 'Location',    color: '#4F508E' },
    { key: 'price',       letter: 'P', label: 'Price',       color: '#754F8E' },
    { key: 'motivation',  letter: 'M', label: 'Motivation',  color: '#8E764F' },
    { key: 'agent',       letter: 'A', label: 'Agent',       color: '#4F7E8E' },
    { key: 'mortgage',    letter: 'M', label: 'Mortgage',    color: '#4F8E50' },
    { key: 'appointment', letter: 'A', label: 'Appointment', color: '#8B8E4F' },
];

// Display order for the Smart Capture 3×2 grid
export const CAPTURE_DISPLAY_ORDER = ['location', 'price', 'motivation', 'agent', 'mortgage', 'appointment'];
