/**
 * Formats a byte count in megabytes with one decimal (e.g. 2516582 → "2.4 MB").
 */
export default function formatFileSize(bytes: number): string {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
