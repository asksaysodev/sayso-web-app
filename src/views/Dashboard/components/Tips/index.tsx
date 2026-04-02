import { useState, useRef, useEffect } from 'react';
import saysoLogo from '/assets/sayso.svg';
import { useQuery } from '@tanstack/react-query';
import getCoachTips from '../../services/getCoachTips';
import TipCardSkeleton from './TipCardSkeleton';

const CARD_GAP = 12;
const MOBILE_BREAKPOINT = 520;

export default function Tips() {
    const [activePage, setActivePage] = useState(0);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [cardWidth, setCardWidth] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(2);
    const touchStartX = useRef(0);
    const prevCppRef = useRef(2);

    const { data, isLoading, isError, isRefetching } = useQuery({
        queryKey: ['coach-tips'],
        queryFn: getCoachTips,
    });

    const tips = data?.tips ?? [];
    const totalPages = Math.ceil(tips.length / cardsPerPage);
    const multiPage = totalPages > 1;

    useEffect(() => {
        const measure = () => {
            if (!viewportRef.current) return;
            const vw = viewportRef.current.offsetWidth;
            const cpp = vw < MOBILE_BREAKPOINT ? 1 : 2;
            if (cpp !== prevCppRef.current) {
                prevCppRef.current = cpp;
                setActivePage(0);
            }
            setCardsPerPage(cpp);
            setCardWidth((vw - (cpp - 1) * CARD_GAP) / cpp);
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (viewportRef.current) ro.observe(viewportRef.current);
        return () => ro.disconnect();
    }, []);

    const trackOffset = activePage * cardsPerPage * (cardWidth + CARD_GAP);

    function handlePageLinePress(i: number) {
        if (i === activePage) return;
        setActivePage(i);
    }

    function navigateOnPressCard(cardIndex: number) {
        const page = Math.floor(cardIndex / cardsPerPage);
        if (page !== activePage) setActivePage(page);
    }

    function handleTouchStart(e: React.TouchEvent) {
        touchStartX.current = e.touches[0].clientX;
    }

    function handleTouchEnd(e: React.TouchEvent) {
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) < 40) return;
        if (delta > 0) setActivePage(p => Math.min(totalPages - 1, p + 1));
        else setActivePage(p => Math.max(0, p - 1));
    }
    
    return (
        <div className="informative-card-container dashboard-cards-left-column tips-widget-container">
            <div className="tips-widget-header">
                <div className="tips-widget-header-title">
                    <img src={saysoLogo} className="tips-widget-logo" alt="Sayso" />
                    <h3>Coach Tips</h3>
                </div>
            </div>

            <div
                ref={viewportRef}
                className="tips-widget-viewport"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="tips-widget-track"
                    style={{
                        transform: `translateX(-${trackOffset}px)`,
                        visibility: cardWidth === 0 ? 'hidden' : 'visible',
                    }}
                >
                    {(isLoading || isRefetching)
                        ? Array.from({ length: cardsPerPage }).map((_, i) => (
                            <TipCardSkeleton key={i} width={cardWidth} />
                        ))
                        : isError
                        ? (
                            <div className="tips-widget-card" style={{ flex: '1' }}>
                                <p className="tips-widget-card-text">Unable to load tips. Please try again later.</p>
                            </div>
                        )
                        : tips.map((tip, i) => (
                        <div
                            key={i}
                            className="tips-widget-card"
                            style={{ flex: `0 0 ${cardWidth}px` }}
                            onClick={() => navigateOnPressCard(i)}
                        >
                            <div className="tips-widget-card-icon-wrap">
                                {i + 1}
                            </div>
                            {tip.title && <h4 className="tips-widget-card-title">{tip.title}</h4>}
                            {tip.body.map(({ text, type }, j) => (
                                <p key={j} className="tips-widget-card-text">
                                    {text}{type === 'paragraph' && <br />}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>

            </div>

            {multiPage && (
                <div className="tips-widget-lines">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            className={`tips-widget-line ${i === activePage ? 'active' : ''}`}
                            onClick={() => handlePageLinePress(i)}
                            aria-label={`Go to page ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
