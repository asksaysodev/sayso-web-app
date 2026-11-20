import { MediaItem } from '@/views/Admin/types';

/** A stored media item as { url, previewUrl }; old rows are plain URLs. */
export function toMediaItem(item: MediaItem): { url: string; previewUrl: string | null } {
    if (typeof item === 'string') return { url: item, previewUrl: null };
    return { url: item.url, previewUrl: item.preview_url || null };
}
