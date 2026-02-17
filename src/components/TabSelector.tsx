export type Tab = {
    label: string;
    value: string;
    icon?: React.ReactNode;
    hidden?: boolean;
}

/**
 * TabSelector - A reusable tab selector component
 * 
 * @param {Object} props
 * @param {Array} props.tabs - Array of tab objects {label: string, value: string, icon?: ReactNode, hidden?: boolean}
 * @param {string} props.selectedValue - Currently selected tab value
 * @param {Function} props.onChange - Callback when tab is selected, receives value as argument
 */

interface Props {
    tabs: Tab[];
    selectedValue: string;
    onChange: (value: string) => void;
}

export default function TabSelector({ tabs, selectedValue, onChange }: Props) {
    const visibleTabs = tabs.filter(tab => !tab.hidden);

    return (
        <div className='tab-selector-container'>
            {visibleTabs.map(({ icon, label, value }) => {
                const isActive = selectedValue === value;
                
                return (
                    <button 
                        key={value} 
                        className={`tab-selector-button ${isActive ? 'active' : ''}`} 
                        onClick={() => onChange(value)}
                    >
                        {icon && icon}
                        <p>{label}</p>
                    </button>
                )
            })}
        </div>
    )
}

