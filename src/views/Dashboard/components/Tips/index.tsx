import SaysoButton from '@/components/SaysoButton';
import { useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface Tip {
    title?: string;
    text: string;
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
                title: 'Appointment Control',
                text: "You're not asking for the appointment enough. The average appointment is booked after the 4th or 5th unique ask. You're stopping after the first or second attempt, even when the conversation is still moving.\nStay with it longer. Ask again after new information comes up."
            },
            {
                title: 'Staying Surface Level',
                text: "You're moving on too quickly after initial answers. This keeps the conversation shallow and makes the meeting feel optional.\nGo one level deeper before moving forward."
            },
            {
                title: 'Missed Openings',
                text: "You're hearing signals but not acting on them. There were moments where the prospect showed interest and the conversation didn't move forward. When interest shows up, shift and move toward the meeting."
            },
        ]
    },
    {
        id: 'whats-working',
        label: "What's working",
        tips: [
            {
                text: "You're getting into conversations and keeping people engaged early."
            }
        ]
    },
    {
        id: 'trends',
        label: 'Trends',
        tips: [
            {
                text: 'Not asking for the appointment showed up in most calls yesterday.'
            }
        ]
    },
]

function chunkIntoPages(tips: Tip[]): Tip[][] {
    const pages: Tip[][] = [];
    for (let i = 0; i < tips.length; i += 2) {
        pages.push(tips.slice(i, i + 2));
    }
    return pages;
}

export default function Tips() {
    const [activePage, setActivePage] = useState(0);
    const [activeReport, setActiveReport] = useState(reportTabs[0].id);

    const currentReport = reportTabs.find(r => r.id === activeReport)!;
    const pages = chunkIntoPages(currentReport.tips);
    const currentPage = pages[activePage];

    function handleReportChange(id: string) {
        setActiveReport(id);
        setActivePage(0);
    }

    return (
        <div className="informative-card-container dashboard-cards-left-column">
            <div className='tips-carousel'>
                {pages.length > 1 && (
                    <div className='tips-carousel-btn' onClick={() => setActivePage((prev) => (prev - 1 + pages.length) % pages.length)}>
                        <LuChevronLeft />
                    </div>
                )}

                <div className={`tips-carousel-content ${currentPage.length === 2 ? 'tips-carousel-content--two' : ''} ${pages.length > 1 ? 'tips-carousel-content--paged' : ''}`}>
                    {currentPage.map((tip, i) => (
                        <div key={i} className='tips-slide'>
                            {tip.title && <p className='tips-slide-title'>{tip.title}</p>}
                            <p className='tips-slide-text'>{tip.text}</p>
                        </div>
                    ))}
                </div>

                {pages.length > 1 && (
                    <div className='tips-carousel-btn' onClick={() => setActivePage((prev) => (prev + 1) % pages.length)}>
                        <LuChevronRight />
                    </div>
                )}

                {pages.length > 1 && (
                    <div className='tips-carousel-dots'>
                        {pages.map((_, i) => (
                            <div
                                key={i}
                                className={`tips-carousel-dot ${i === activePage ? 'active' : ''}`}
                                onClick={() => setActivePage(i)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className='tips-report-tabs'>
                {reportTabs.map(({ id, label }) => (
                    <SaysoButton
                        key={id}
                        label={label}
                        variant='outlined'
                        active={id === activeReport}
                        onClick={() => handleReportChange(id)}
                    />
                ))}
            </div>
        </div>
    )
}
