import { AdminStore } from "@/types/store/adminStore";
import { SignalVersion, Tool } from "@/views/Admin/types";
import { create } from "zustand";

export const useAdminStore = create<AdminStore>((set) => ({
    selectedTool: 'cue-signals',

    signalSheets: [],
    activeSheetVersion: 1,
    liveSheetVersion: 1,

    setSelectedTool: (selectedTool: Tool) => set({ selectedTool }),

    setSignalSheets: (sheets: SignalVersion[]) => set({ signalSheets: sheets }),
    setActiveSheetVersion: (version: number) => set({ activeSheetVersion: version }),
    setLiveSheetVersion: (version: number) => set({ liveSheetVersion: version }),
}));
