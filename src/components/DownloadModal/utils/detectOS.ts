export type DesktopOS = 'mac' | 'windows';

interface NavigatorUAData {
    platform?: string;
}

/**
 * Best-effort desktop OS detection used to pick the recommended download.
 * Returns null for anything that isn't macOS or Windows (Linux, mobile, unknown).
 */
export function detectOS(): DesktopOS | null {
    const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData }).userAgentData;
    const platform = (uaData?.platform || navigator.userAgent).toLowerCase();

    if (/iphone|ipad|android/.test(navigator.userAgent.toLowerCase())) return null;
    if (platform.includes('mac')) return 'mac';
    if (platform.includes('win')) return 'windows';
    return null;
}
