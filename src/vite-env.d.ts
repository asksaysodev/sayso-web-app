/// <reference types="vite/client" />

declare global {
    interface Window {
        debugStorage: () => void;
    }
}

export {};