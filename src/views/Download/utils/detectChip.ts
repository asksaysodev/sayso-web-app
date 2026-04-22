export function detectChip(): 'silicon' | 'intel' | 'unknown' {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        const ext = gl?.getExtension('WEBGL_debug_renderer_info');
        const renderer = ext ? (gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string) : '';
        if (renderer?.toLowerCase().includes('apple')) return 'silicon';
        if (renderer) return 'intel';
    } catch {
        // ignore
    }
    return 'unknown';
}
