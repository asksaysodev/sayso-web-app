import { useQuery } from '@tanstack/react-query';
import { GITHUB_RELEASES_API } from '@/constants';

interface ReleaseAsset {
    name: string;
    browser_download_url: string;
}

const fetchRelease = async () => {
    const res = await fetch(GITHUB_RELEASES_API);
    const data = await res.json();
    const dmgs: ReleaseAsset[] = data.assets.filter((a: ReleaseAsset) => a.name.endsWith('.dmg'));
    return {
        siliconUrl: dmgs.find(a => a.name.includes('arm64'))?.browser_download_url ?? null,
        intelUrl: dmgs.find(a => !a.name.includes('arm64'))?.browser_download_url ?? null,
    };
};

export function useDownloadGithubRelease(enabled: boolean) {
    const { data } = useQuery({
        queryKey: ['github-release'],
        queryFn: fetchRelease,
        enabled,
    });

    const handleDownload = (url: string | null | undefined) => {
        if (!url) return;
        window.open(url, '_blank');
    };

    return {
        siliconUrl: data?.siliconUrl,
        intelUrl: data?.intelUrl,
        handleDownload,
    };
}
