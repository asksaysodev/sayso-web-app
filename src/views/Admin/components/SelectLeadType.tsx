import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useAdminStore } from "@/store/adminStore";

export default function SelectLeadType() {
    const leadType = useAdminStore(state => state.leadType);
    const setLeadType = useAdminStore(state => state.setLeadType);

    return (
        <div className="select-lead-type-container">
            <label htmlFor="lead-type-select">Lead Type</label>
            <Select value={leadType} onValueChange={setLeadType}>
                <SelectTrigger className="w-[180px] sayso-outlined-button !h-10">
                    <SelectValue placeholder="Select a lead type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}