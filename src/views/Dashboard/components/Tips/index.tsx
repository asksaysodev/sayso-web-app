import { useState, useRef, useEffect } from 'react';
import saysoLogo from '/assets/sayso.svg';
import {
    LuCalendarDays,
    LuAlignJustify,
    LuTarget,
    LuThumbsUp,
    LuTrendingUp,
    LuChevronLeft,
    LuChevronRight,
} from 'react-icons/lu';

interface Tip {
    title?: string;
    text: string;
    icon?: React.ReactNode;
}

interface ReportTab {
    id: string;
    label: string;
    tips: Tip[];
}

const reportTabs: ReportTab[] = [
    {
        id: 'coach-tips',
        label: 'Coach tips',
        tips: [
            {
                icon: <LuCalendarDays />,
                title: 'Appointment Control',
                text: "You're not asking for the appointment enough. The average appointment is booked after the 4th or 5th unique ask. You're stopping after the first or second attempt, even when the conversation is still moving.\nStay with it longer. Ask again after new information comes up."
            },
            {
                icon: <LuAlignJustify />,
                title: 'Staying Surface Level',
                text: "You're moving on too quickly after initial answers. This keeps the conversation shallow and makes the meeting feel optional.\nGo one level deeper before moving forward."
            },
            {
                icon: <LuTarget />,
                title: 'Missed Openings',
                text: "You're hearing signals but not acting on them. There were moments where the prospect showed interest and the conversation didn't move forward. When interest shows up, shift and move toward the meeting."
            },
        ]
    },
    // {
    //     id: 'whats-working',
    //     label: "What's working",
    //     tips: [
    //         {
    //             icon: <LuThumbsUp />,
    //             text: "You're getting into conversations and keeping people engaged early."
    //         }
    //     ]
    // },
    // {
    //     id: 'trends',
    //     label: 'Trends',
    //     tips: [
    //         {
    //             icon: <LuTrendingUp />,
    //             text: 'Not asking for the appointment showed up in most calls yesterday.'
    //         }
    //     ]
    // },
];

const CARD_GAP = 12;
const PEEK = 24;

export default function Tips() {
    const [activePage, setActivePage] = useState(0);
    const [activeReport, setActiveReport] = useState(reportTabs[0].id);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [cardWidth, setCardWidth] = useState(0);

    const currentReport = reportTabs.find(r => r.id === activeReport)!;
    const tips = currentReport.tips;
    const totalPages = Math.ceil(tips.length / 2);
    const multiPage = totalPages > 1;

    useEffect(() => {
        const measure = () => {
            if (!viewportRef.current) return;
            const vw = viewportRef.current.offsetWidth;
            // With peek: 2 cards + 2 gaps + peek = vw → card = (vw - 2*gap - peek) / 2
            // Without peek (single page): 2 cards + 1 gap = vw → card = (vw - gap) / 2
            setCardWidth(multiPage ? (vw - 2 * CARD_GAP - PEEK) / 2 : (vw - CARD_GAP) / 2);
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (viewportRef.current) ro.observe(viewportRef.current);
        return () => ro.disconnect();
    }, [multiPage]);

    // Each page = 2 cards + 2 gaps (the gap before the next page's first card is included)
    const trackOffset = activePage * (2 * cardWidth + 2 * CARD_GAP);

    function handlePrev() {
        setActivePage(p => Math.max(0, p - 1));
    }

    function handleNext() {
        setActivePage(p => Math.min(totalPages - 1, p + 1));
    }

    function handleReportChange(id: string) {
        setActiveReport(id);
        setActivePage(0);
    }

    return (
        <div className="informative-card-container dashboard-cards-left-column tips-widget-container">
            <div className="tips-widget-header">
                <div className="tips-widget-header-title">
                    <img src={saysoLogo} className="tips-widget-logo" alt="Sayso" />
                    <h3>Coach Tips</h3>
                </div>
            </div>

            <div ref={viewportRef} className="tips-widget-viewport">
                <div
                    className="tips-widget-track"
                    style={{
                        transform: `translateX(-${trackOffset}px)`,
                        visibility: cardWidth === 0 ? 'hidden' : 'visible',
                    }}
                >
                    {tips.map((tip, i) => (
                        <div
                            key={i}
                            className="tips-widget-card"
                            style={{ flex: `0 0 ${cardWidth}px` }}
                        >
                            {tip.icon && (
                                <div className="tips-widget-card-icon-wrap">
                                    {tip.icon}
                                </div>
                            )}
                            {tip.title && <h4 className="tips-widget-card-title">{tip.title}</h4>}
                            <p className="tips-widget-card-text">{tip.text}</p>
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
                            onClick={i > activePage ? handleNext : handlePrev}
                            aria-label={`Go to page ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/*<div className="tips-widget-tabs">
                {reportTabs.map(({ id, label }) => (
                    <button
                        key={id}
                        className={`tips-widget-tab ${id === activeReport ? 'active' : ''}`}
                        onClick={() => handleReportChange(id)}
                    >
                        {label}
                    </button>
                ))}
            </div>*/}
        </div>
    );
}
