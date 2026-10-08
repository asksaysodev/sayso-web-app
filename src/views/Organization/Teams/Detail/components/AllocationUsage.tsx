import clsx from 'clsx';
import { ProgressBar } from '@/components/ds/ProgressBar';
import type { TeamStatus } from '@/views/Organization/shared/types';
import allocationTone from '../../utils/allocationTone';
import './AllocationUsage.css';

interface Props {
    title: string;
    usedHours: number;
    capHours: number | null;
    capPercent: number | null;
    status: TeamStatus;
    variant: 'card' | 'panel';
}

export default function AllocationUsage({ title, usedHours, capHours, capPercent, status, variant }: Props) {
    const allocation = allocationTone(status);

    return (
        <div className={clsx('allocation-usage', `allocation-usage--${variant}`)}>
            <div className='allocation-usage__head'>
                <span className='allocation-usage__title'>{title}</span>
                <span className='allocation-usage__hours'>
                    <span className='allocation-usage__used'>{usedHours}</span>
                    {capHours === null ? 'hs' : `/ ${capHours} hs`}
                </span>
            </div>
            {allocation === null ? (
                <p className='allocation-usage__status'>No cap set</p>
            ) : (
                <div className={`allocation-usage__meter allocation-usage__meter--${allocation.tone}`}>
                    <div className='allocation-usage__bar'>
                        <ProgressBar
                            className='allocation-usage__progress'
                            value={capPercent ?? 0}
                            tone={allocation.tone}
                            aria-label={title}
                        />
                        <span className='allocation-usage__percent'>{capPercent}%</span>
                    </div>
                    <p className='allocation-usage__status'>
                        <allocation.Icon size={16} aria-hidden />
                        {allocation.label}
                    </p>
                </div>
            )}
        </div>
    );
}
