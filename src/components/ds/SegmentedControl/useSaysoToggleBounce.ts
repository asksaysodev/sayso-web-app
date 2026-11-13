import { useEffectEvent, useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';

/**
 * sayso-toggle-bounce-animation
 *
 * A sliding thumb that stretches toward the option you press, holds while the pointer is down,
 * and on release completes the trip: the leading edge arrives first (the thumb spans both
 * options), then the trailing edge snaps over, overshoots and settles.
 *
 * Driven by the Web Animations API because the keyframes depend on measured option positions.
 * Honors prefers-reduced-motion (the thumb just jumps).
 */
export const SAYSO_TOGGLE_BOUNCE_ANIMATION = 'sayso-toggle-bounce-animation';

/** Share of the distance to the pressed option the thumb reaches while the pointer is held down. */
const PRESS_REACH = 0.16;
const PRESS_MS = 80;
const PRESS_EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

const TRAVEL_MS = 240;
/** How far (px) the thumb overshoots the target before settling. */
const OVERSHOOT_PX = 6;

const RETRACT_MS = 220;
/** Back-out curve: overshoots slightly on the way back to rest. */
const RETRACT_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

interface Box {
    left: number;
    width: number;
}

const toFrame = (box: Box) => ({ left: `${box.left}px`, width: `${box.width}px` });

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Options {
    enabled: boolean;
    activeIndex: number;
    containerRef: RefObject<HTMLElement | null>;
    itemRefs: RefObject<(HTMLElement | null)[]>;
}

export default function useSaysoToggleBounce({ enabled, activeIndex, containerRef, itemRefs }: Options) {
    const thumbRef = useRef<HTMLSpanElement>(null);
    const animationRef = useRef<Animation | null>(null);
    const placedIndexRef = useRef<number | null>(null);
    const pressedIndexRef = useRef<number | null>(null);

    function itemBox(index: number): Box | null {
        const item = itemRefs.current?.[index];
        return item ? { left: item.offsetLeft, width: item.offsetWidth } : null;
    }

    /** Where the thumb is drawn right now, mid-animation included. */
    function liveBox(): Box | null {
        const thumb = thumbRef.current;
        const container = containerRef.current;
        if (!thumb || !container) return null;
        const thumbRect = thumb.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        return { left: thumbRect.left - containerRect.left - container.clientLeft, width: thumbRect.width };
    }

    function place(box: Box) {
        const thumb = thumbRef.current;
        if (!thumb) return;
        animationRef.current?.cancel();
        thumb.style.left = `${box.left}px`;
        thumb.style.width = `${box.width}px`;
    }

    /** Rests the thumb at `end`, animating there through `frames` from wherever it is now. */
    function play(end: Box, frames: Keyframe[], options: KeyframeAnimationOptions) {
        const thumb = thumbRef.current;
        if (!thumb) return;
        const from = liveBox();
        place(end);
        if (!from || prefersReducedMotion()) return;
        animationRef.current = thumb.animate([toFrame(from), ...frames, toFrame(end)], options);
    }

    function travel(target: Box) {
        const from = liveBox();
        if (!from) return place(target);
        const dir = Math.sign(target.left - from.left) || 1;
        const spanLeft = Math.min(from.left, target.left);
        const spanRight = Math.max(from.left + from.width, target.left + target.width);
        play(
            target,
            [
                // Stretch: leading edge reaches the target while the trailing edge holds.
                { offset: 0.4, left: `${spanLeft}px`, width: `${spanRight - spanLeft}px`, easing: 'cubic-bezier(0.5, 0, 0.2, 1)' },
                // Snap: trailing edge whips over and the thumb overshoots, slightly squashed.
                { offset: 0.68, left: `${target.left + dir * OVERSHOOT_PX}px`, width: `${target.width - OVERSHOOT_PX}px`, easing: 'ease-in-out' },
                // Bounce back past center, then settle.
                { offset: 0.85, left: `${target.left - dir * OVERSHOOT_PX * 0.35}px`, width: `${target.width}px`, easing: 'ease-out' },
            ],
            { duration: TRAVEL_MS },
        );
    }

    function retract() {
        if (pressedIndexRef.current === null) return;
        pressedIndexRef.current = null;
        const rest = itemBox(activeIndex);
        if (rest) play(rest, [], { duration: RETRACT_MS, easing: RETRACT_EASING });
    }

    // Rest on the active option on mount; animate the trip when the value changes.
    const syncToActive = useEffectEvent(() => {
        const target = itemBox(activeIndex);
        if (!target) return;
        const changed = placedIndexRef.current !== null && placedIndexRef.current !== activeIndex;
        placedIndexRef.current = activeIndex;
        pressedIndexRef.current = null;
        if (changed) travel(target);
        else place(target);
    });

    useLayoutEffect(() => {
        if (enabled) syncToActive();
    }, [enabled, activeIndex]);

    // Option widths change with fonts loading and responsive layout: keep the resting thumb aligned.
    const realign = useEffectEvent(() => {
        if (animationRef.current?.playState === 'running') return;
        const box = itemBox(placedIndexRef.current ?? activeIndex);
        if (box) place(box);
    });

    const observeSizes = useEffectEvent((observer: ResizeObserver) => {
        if (containerRef.current) observer.observe(containerRef.current);
        itemRefs.current?.forEach((item) => item && observer.observe(item));
    });

    useLayoutEffect(() => {
        if (!enabled || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => realign());
        observeSizes(observer);
        return () => observer.disconnect();
    }, [enabled]);

    useLayoutEffect(() => () => animationRef.current?.cancel(), []);

    /** Pointer down on an option: stretch toward it (only for an unselected option). */
    function onPress(index: number, event: ReactPointerEvent) {
        if (!enabled || index === activeIndex || event.button !== 0) return;
        const rest = itemBox(activeIndex);
        const target = itemBox(index);
        if (!rest || !target) return;
        pressedIndexRef.current = index;
        const reach = Math.abs(target.left - rest.left) * PRESS_REACH;
        const end = target.left > rest.left
            ? { left: rest.left, width: rest.width + reach }
            : { left: rest.left - reach, width: rest.width + reach };
        play(end, [], { duration: PRESS_MS, easing: PRESS_EASING });
    }

    /**
     * Pointer up: the click that follows changes the value, and the layout effect completes the trip.
     * If the value doesn't change (the parent rejected it), snap back instead.
     */
    function onRelease() {
        if (pressedIndexRef.current === null) return;
        window.setTimeout(retract, 50);
    }

    return { thumbRef, onPress, onRelease, onCancel: retract };
}
