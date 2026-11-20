import { SelectField, type SelectFieldOption } from '@/components/ds/SelectField';
import { useAdminStore } from '@/store/adminStore';

export default function SheetVersionSelector() {
    const signalSheets = useAdminStore(state => state.signalSheets);
    const activeSheetVersion = useAdminStore(state => state.activeSheetVersion);
    const setActiveSheetVersion = useAdminStore(state => state.setActiveSheetVersion);

    if (!signalSheets || signalSheets.length === 0 || !activeSheetVersion) return null;

    const options: SelectFieldOption<string>[] = signalSheets.map((sheet) => ({
        value: String(sheet.version),
        label: String(sheet.version),
    }));

    return (
        <SelectField
            className='sheet-version-selector'
            label='Sheet Version'
            options={options}
            value={String(activeSheetVersion)}
            onChange={(value) => setActiveSheetVersion(Number(value))}
            placeholder='Select a version'
        />
    );
}
