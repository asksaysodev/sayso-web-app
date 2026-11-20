import { getLoomEmbedUrl } from './getLoomEmbedUrl';
import { getYouTubeEmbedUrl } from './getYoutubeEmbedUrl';

/** The iframe URL for a YouTube or Loom link, or null for anything else. */
export function getMediaEmbedUrl(url: string): string | null {
    return getYouTubeEmbedUrl(url) ?? getLoomEmbedUrl(url);
}
