import { useQuery } from '@tanstack/react-query';
import { GITHUB_RELEASES_API } from '@/constants';
import reportApiError from '@/utils/reportApiError';

interface ReleaseAsset {
    name: string;
    browser_download_url: string;
}

interface FetchedRelease {
    siliconUrl: string | null;
    intelUrl: string | null;
    windowsUrl: string | null;
    version: string | null;
}

const fetchRelease = async (): Promise<FetchedRelease> => {
    try {
        const res = await fetch(GITHUB_RELEASES_API);
        if (!res.ok) throw new Error(`GitHub release fetch failed with status ${res.status}`);

        const data = await res.json();
        if (!Array.isArray(data.assets)) throw new Error('GitHub release payload has no assets');

        const assets: ReleaseAsset[] = data.assets.filter(
            (a: ReleaseAsset) => typeof a.name === 'string' && typeof a.browser_download_url === 'string'
        );
        const dmgs = assets.filter(a => a.name.endsWith('.dmg'));
        const exes = assets.filter(a => a.name.endsWith('.exe'));

        return {
            siliconUrl: dmgs.find(a => a.name.includes('arm64'))?.browser_download_url ?? null,
            intelUrl: dmgs.find(a => !a.name.includes('arm64'))?.browser_download_url ?? null,
            windowsUrl: (exes.find(a => a.name.endsWith('-x64-win.exe')) ?? exes[0])?.browser_download_url ?? null,
            version: data.tag_name ?? null,
        };
    } catch (error) {
        reportApiError(error, { feature: 'download', operation: 'fetchGithubRelease' });
        throw error;
    }
};

export function useDownloadGithubRelease() {
    const { data, isLoading } = useQuery({
        queryKey: ['github-release'],
        queryFn: fetchRelease,
    });

    return {
        siliconUrl: data?.siliconUrl ?? null,
        intelUrl: data?.intelUrl ?? null,
        windowsUrl: data?.windowsUrl ?? null,
        version: data?.version ?? null,
        isLoading,
    };
}
