const KB = 1024;
const MB = KB * 1024;

/**
 * Formats a byte count in KB below 1 MB (e.g. 18432 → "18 KB"), otherwise in MB with one
 * decimal (e.g. 2516582 → "2.4 MB").
 */
export default function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 KB';
    if (bytes < MB) return `${Math.max(1, Math.round(bytes / KB))} KB`;
    return `${(bytes / MB).toFixed(1)} MB`;
}
