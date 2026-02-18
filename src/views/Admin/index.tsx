import ViewLayout from '@/components/layouts/ViewLayout';

import './Admin.css';
import { useCallback } from 'react';
import ToolSelector from './components/ToolSelector';
import CueMainInstructions from './components/CueMainInstructions';
import { useAdminStore } from '@/store/adminStore';
import CueSignals from './components/CueSignals';
import ImportSheetButton from './components/ImportSheetButton';
import SheetVersionSelector from './components/SheetVersionSelector';

export default function Admin() {
    const selectedTool = useAdminStore(state => state.selectedTool);
    const setSelectedTool = useAdminStore(state => state.setSelectedTool);

    const renderTool = useCallback(() => {
        if (selectedTool === 'cue-signals') {
            return <CueSignals />
        }
        return <CueMainInstructions />
    }, [selectedTool]);

    return (
       <ViewLayout title='Admin Panel'>
            <div className='admin-panel-container'>
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
