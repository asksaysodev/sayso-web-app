export type ConversationTab = 'Cue' | 'Smart Capture' | 'Pulse';

const TABS: ConversationTab[] = ['Cue', 'Smart Capture', 'Pulse'];

interface Props {
    value: ConversationTab;
    onChange: (tab: ConversationTab) => void;
}

export default function ConversationTabs({ value, onChange }: Props) {
    return (
        <div className="conv-tabs">
            {TABS.map(tab => (
                <button
                    key={tab}
                    className={`conv-tab${value === tab ? ' conv-tab-on' : ''}`}
                    onClick={() => onChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
