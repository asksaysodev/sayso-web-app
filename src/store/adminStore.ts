import { AdminStore } from "@/types/store/adminStore";
import { LeadType } from "@/types/coach";
import { SignalVersion, Tool } from "@/views/Admin/types";
import { create } from "zustand";

export const useAdminStore = create<AdminStore>((set) => ({
    selectedTool: 'cue-signals',
    leadType: 'buyer',

    signalSheets: [],
    activeSheetVersion: 1,
    liveSheetVersion: 1,

    setSelectedTool: (selectedTool: Tool) => set({ selectedTool }),
    setLeadType: (leadType: LeadType) => set({ leadType }),

    setSignalSheets: (sheets: SignalVersion[]) => set({ signalSheets: sheets }),
    setActiveSheetVersion: (version: number) => set({ activeSheetVersion: version }),
    setLiveSheetVersion: (version: number) => set({ liveSheetVersion: version }),
}));
