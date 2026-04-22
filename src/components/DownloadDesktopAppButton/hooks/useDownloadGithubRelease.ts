import { useQuery } from '@tanstack/react-query';
import { GITHUB_RELEASES_API } from '@/constants';
import { openExternal } from '@/utils/helpers/openExternal';

interface ReleaseAsset {
    name: string;
    browser_download_url: string;
}

interface FetchedRelease {
    siliconUrl: string | null;
    intelUrl: string | null;
    version: string | null;
    publishedAt: string | null;
}

const fetchRelease = async (): Promise<FetchedRelease | undefined> => {
    const res = await fetch(GITHUB_RELEASES_API);
    if (!res.ok) return;

    const data = await res.json();

    if (!Array.isArray(data.assets)) return;

    const dmgs: ReleaseAsset[] = data.assets.filter(
        (a: ReleaseAsset) => typeof a.name ==='string' && a.name.endsWith('.dmg')
    );

    return {
        siliconUrl: dmgs.find(a => a.name.includes('arm64'))?.browser_download_url ?? null,
        intelUrl: dmgs.find(a => !a.name.includes('arm64'))?.browser_download_url ?? null,
        version: data.tag_name ?? null,
        publishedAt: data.published_at ?? null,
    };
};

export function useDownloadGithubRelease(enabled: boolean) {
    const { data, isLoading } = useQuery({
        queryKey: ['github-release'],
        queryFn: fetchRelease,
        enabled,
    });
    
    const handleDownload = (url: string | null | undefined) => {
        if (!url) return;
        openExternal(url)
    };

    return {
        siliconUrl: data?.siliconUrl ?? null,
        intelUrl: data?.intelUrl ?? null,
        version: data?.version ?? null,
        publishedAt: data?.publishedAt ?? null,
        handleDownload,
        isLoadingUrls: isLoading
    };
}
