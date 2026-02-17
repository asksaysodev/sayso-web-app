import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAdminStore } from "@/store/adminStore";

export default function SheetVersionSelector() {
    const signalSheets = useAdminStore(state => state.signalSheets);
    const activeSheetVersion = useAdminStore(state => state.activeSheetVersion);
    const setActiveSheetVersion = useAdminStore(state => state.setActiveSheetVersion);

    return (
        <div className="sheet-version-selector-container">
            <label htmlFor="sheet-version-select">Sheet Version</label>
            <Select value={String(activeSheetVersion)} onValueChange={(v) => setActiveSheetVersion(Number(v))}>
                <SelectTrigger className="w-[180px] sayso-outlined-button !h-10">
                    <SelectValue placeholder="Select a version" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {signalSheets.map((sheet) => (
                            <SelectItem key={sheet.version} value={String(sheet.version)}>
                                {sheet.version}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
