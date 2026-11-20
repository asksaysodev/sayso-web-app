import { getMediaEmbedUrl } from './getMediaEmbedUrl';
import { isFileVideo } from './isFileVideo';

/** Whether a media URL isn't an embed or a video, so it may be shown as a link with a preview image. */
export function isWebLink(url: string) {
    return !getMediaEmbedUrl(url) && !isFileVideo(url);
}
