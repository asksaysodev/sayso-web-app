const MOBILE_BREAKPOINT = 768;

export function isMobileViewport(): boolean {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}
