interface NavigatorUAData {
    mobile?: boolean;
}

/**
 * True on phone and tablet browsers (iPhone, iPad, Android), by device rather than viewport
 * width: iPads are wider than our mobile breakpoint, but like phones they bring a new tab to
 * the front and pause the page that opened it (SAYSO-604).
 */
export function isMobileBrowser(): boolean {
    if (typeof navigator === 'undefined') return false;

    // Chromium browsers (Android Chrome, Edge, Samsung Internet) report it directly.
    const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData }).userAgentData;
    if (uaData?.mobile) return true;

    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod|Android/i.test(ua)) return true;

    // iPadOS 13+ reports itself as a Mac; real Macs have no touch points.
    return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
}
