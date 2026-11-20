export function getLoomEmbedUrl(url: string): string | null {
    const match = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    return `https://www.loom.com/embed/${match[1]}`;
}
