export function isFileVideo(url: string) {
    return /\.(mp4|webm|mov|ogg|avi)(\?.*)?$/i.test(url);
}