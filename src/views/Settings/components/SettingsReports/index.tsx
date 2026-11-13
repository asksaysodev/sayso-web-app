import { PiCalendarCheck, PiCheck, PiClock } from 'react-icons/pi';
import clsx from 'clsx';
import { Card } from '@/components/ds/Card';
import { Button } from '@/components/ds/Button';
import { Radio } from '@/components/ds/Radio';
import { Switch } from '@/components/ui/switch';
import useReportPreferences from '@/hooks/useReportPreferences';
import type { ReportFrequency } from '@/types/reportPreferences';
import './SettingsReports.css';

const WEEKDAYS = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
];

const FREQUENCIES: { value: ReportFrequency; label: string }[] = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

/** Formats YYYY-MM-DD as a local calendar date (never via UTC) e.g. "Monday, November 3". */
function formatNextSend(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
}

export default function SettingsReports() {
    const { preferences, isLoading, isError, isFetching, refetch, isSaving, save } = useReportPreferences();

    if (isLoading) {
        return (
            <div className='settings-reports' role='status' aria-label='Loading report preferences'>
                {[72, 56, 104].map((height, index) => (
                    <Card key={index} className='reports-card'>
                        <div className='skeleton reports-skeleton' style={{ height }} />
                    </Card>
                ))}
            </div>
        );
    }

    if (isError || !preferences) {
        return (
            <div className='settings-reports'>
                <Card className='reports-card reports-card--state' role='alert'>
                    Couldn't load your report preferences.
                    <Button variant='secondary' size='sm' onClick={() => refetch()} loading={isFetching}>
                        Try again
                    </Button>
                </Card>
            </div>
        );
    }

    const { enabled, frequency, weekday, sendTime, nextSend } = preferences;
    const controlsDisabled = !enabled || isSaving;

    return (
        <div className='settings-reports'>
            <Card className='reports-card'>
                <h2 className='reports-card__title'>Reports</h2>
                <div className='reports-toggle'>
                    <div className='reports-toggle__text'>
                        <span className='reports-toggle__label'>Email reports</span>
                        <p className='reports-card__text'>Get a summary of your company's activity by email.</p>
                    </div>
                    <Switch
                        checked={enabled}
                        disabled={isSaving}
                        onCheckedChange={(checked) => save({ enabled: checked })}
                        aria-label='Email reports'
                        className='data-[state=checked]:bg-[var(--interactive)] data-[state=unchecked]:bg-input'
                    />
                </div>
            </Card>

            <Card className={clsx('reports-card', !enabled && 'reports-card--disabled')}>
                <h2 className='reports-card__title'>Frequency</h2>
                <div className='reports-frequency' role='radiogroup' aria-label='Frequency'>
                    {FREQUENCIES.map(({ value, label }) => (
                        <Radio
                            key={value}
                            name='report-frequency'
                            label={label}
                            checked={frequency === value}
                            disabled={controlsDisabled}
                            onChange={() => save({ frequency: value })}
                        />
                    ))}
                </div>
            </Card>

            <Card className={clsx('reports-card', !enabled && 'reports-card--disabled')}>
                <h2 className='reports-card__title'>Delivery day</h2>
                {frequency === 'weekly' ? (
                    <div className='reports-days' role='group' aria-label='Delivery day'>
                        {WEEKDAYS.map(({ value, label }) => {
                            const selected = weekday === value;
                            return (
                                <button
                                    key={value}
                                    type='button'
                                    className={clsx('reports-day', selected && 'reports-day--selected')}
                                    aria-pressed={selected}
                                    disabled={controlsDisabled}
                                    onClick={() => { if (!selected) save({ weekday: value }); }}
                                >
                                    {selected && <PiCheck size={14} aria-hidden />}
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <p className='reports-card__text'>Sent on the 1st of every month.</p>
                )}

                {enabled && nextSend && (
                    <div className='reports-next'>
                        <div className='reports-next__main'>
                            <span className='reports-next__icon' aria-hidden>
                                <PiCalendarCheck size={18} />
                            </span>
                            <strong className='reports-next__date'>Next report: {formatNextSend(nextSend.date)}.</strong>
                        </div>
                        <span className='reports-next__time'>
                            <PiClock size={14} aria-hidden />
                            Reports are sent around {sendTime.label}
                        </span>
                    </div>
                )}
            </Card>
        </div>
    );
}
