export function getYouTubeEmbedUrl(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!match) return null;
    return `https://www.youtube.com/embed/${match[1]}`;
}

export function isFileVideo(url: string): boolean {
    return /\.(mp4|webm|mov|ogg|avi)(\?.*)?$/i.test(url);
}
