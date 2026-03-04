import ViewLayout from '@/components/layouts/ViewLayout';

import './Admin.css';
import { useCallback } from 'react';
import ToolSelector from './components/ToolSelector';
import CueMainInstructions from './components/CueMainInstructions';
import { useAdminStore } from '@/store/adminStore';
import CueSignals from './components/CueSignals';
import ImportSheetButton from './components/ImportSheetButton';
import SheetVersionSelector from './components/SheetVersionSelector';
import SubscriptionAdmin from './components/SubscriptionAdmin';

export default function Admin() {
    const selectedTool = useAdminStore(state => state.selectedTool);
    const setSelectedTool = useAdminStore(state => state.setSelectedTool);

    const renderTool = useCallback(() => {
        switch(selectedTool) {
            case 'cue-signals': return <CueSignals />
            case 'cue-main-instructions': return <CueMainInstructions />
            case 'subscription': return <SubscriptionAdmin />
        }
    }, [selectedTool]);

    return (
       <ViewLayout title='Admin Panel' scrollable>
            <div className={`admin-panel-container${selectedTool === 'cue-signals' ? ' centered' : ''}`}>
                <div className='admin-panel-header'>
                    <div className='admin-panel-header-left-actions'>
                        <ToolSelector selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
                        {selectedTool === 'cue-signals' && <SheetVersionSelector />}
                    </div>

                    {selectedTool === 'cue-signals' && <div className='admin-panel-header-right-actions'>
                        <ImportSheetButton />
                    </div>}
                </div>

                {renderTool()}
            </div>
       </ViewLayout>
    )
}
