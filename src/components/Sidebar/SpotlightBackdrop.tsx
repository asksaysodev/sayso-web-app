import { useEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';

const HOLE_PADDING = 6;
const HOLE_RADIUS = 12;

interface Rect { x: number; y: number; w: number; h: number }

interface Props {
    target: RefObject<HTMLElement | null>;
    onDismiss: () => void;
}

function sameRect(a: Rect | null, b: Rect) {
    return !!a && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}

/**
 * Dims the page around the spotlighted element. The cut-out is a hole in an even-odd SVG path,
 * so the element stays bright and clickable; a click on the dimmed area calls onDismiss.
 */
export default function SpotlightBackdrop({ target, onDismiss }: Props) {
    const [rect, setRect] = useState<Rect | null>(null);
    const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });

    // Follow the target through resizes and the sidebar's collapse transition.
    useEffect(() => {
        let frame = 0;
        const tick = () => {
            const el = target.current;
            if (el) {
                const r = el.getBoundingClientRect();
                const next = { x: r.left, y: r.top, w: r.width, h: r.height };
                setRect(prev => (sameRect(prev, next) ? prev : next));
            }
            setViewport(prev => (prev.w === window.innerWidth && prev.h === window.innerHeight
                ? prev
                : { w: window.innerWidth, h: window.innerHeight }));
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target]);

    if (!rect) return null;

    const x = rect.x - HOLE_PADDING;
    const y = rect.y - HOLE_PADDING;
    const w = rect.w + HOLE_PADDING * 2;
    const h = rect.h + HOLE_PADDING * 2;
    const r = Math.min(HOLE_RADIUS, w / 2, h / 2);
    const hole = `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

    return createPortal(
        <svg className='sidebar__spotlight-backdrop' width={viewport.w} height={viewport.h} aria-hidden='true'>
            <path d={`M0 0H${viewport.w}V${viewport.h}H0Z ${hole}`} fillRule='evenodd' onClick={onDismiss} />
        </svg>,
        document.body
    );
}
