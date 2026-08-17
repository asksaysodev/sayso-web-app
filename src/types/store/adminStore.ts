import { SignalVersion, Tool } from "@/views/Admin/types";

export interface AdminStore {
    selectedTool: Tool;
    setSelectedTool: (selectedTool: Tool) => void;

    /** All signal sheets available for the user to see. */
    signalSheets: SignalVersion[];
    /** The version currently live in Production. */
    liveSheetVersion: number;
    /** The version the user has selected to view in the UI. */
    activeSheetVersion: number;

    setSignalSheets: (sheets: SignalVersion[]) => void;
    setLiveSheetVersion: (version: number) => void;
    setActiveSheetVersion: (version: number) => void;
}
