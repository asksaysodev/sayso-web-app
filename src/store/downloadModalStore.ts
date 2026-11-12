import { create } from 'zustand';

interface DownloadModalStore {
    open: boolean;
    setOpen: (open: boolean) => void;
}

/** The "Download Sayso" modal is mounted once in Layout; anything can open it from here. */
export const useDownloadModalStore = create<DownloadModalStore>((set) => ({
    open: false,
    setOpen: (open) => set({ open }),
}));
