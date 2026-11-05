import { SelectField, type SelectFieldOption } from '@/components/ds/SelectField';
import { Tool } from '../types';

interface Props {
    selectedTool: Tool;
    setSelectedTool: (tool: Tool) => void;
}

const tools: SelectFieldOption<Tool>[] = [
    { value: 'cue-signals', label: 'Cue Signals' },
    { value: 'subscription', label: 'Subscription Admin' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'partners', label: 'Partners' },
    { value: 'playbooks', label: 'Playbooks' },
    { value: 'workshops', label: 'Workshops' },
    // { value: 'cue-main-instructions', label: 'Cue Main Instructions' },
];

export default function ToolSelector({ selectedTool, setSelectedTool }: Props) {
    return (
        <SelectField
            className='tool-selector'
            label='Tool'
            options={tools}
            value={selectedTool}
            onChange={setSelectedTool}
            placeholder='Select a tool'
        />
    );
}
