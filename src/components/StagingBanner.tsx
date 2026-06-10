const IS_STAGING = import.meta.env.VITE_APP_ENV === 'staging';

export default function StagingBanner() {
  if (!IS_STAGING) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-400/40 text-amber-950 text-center py-0.5 text-[11px] font-semibold uppercase tracking-widest pointer-events-none select-none">
      Staging Environment
    </div>
  );
}
