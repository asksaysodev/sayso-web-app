import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { FieldMessage, FieldShell } from '@/components/ds/FieldShell';
import displayName from '@/views/Organization/shared/utils/displayName';
import MemberIdentity from './MemberIdentity';
import type { PickerMember } from './types';
import './MemberPicker.css';

export interface MemberPickerProps {
    label: ReactNode;
    members: PickerMember[];
    value: string[];
    onChange: (ids: string[]) => void;
    isLoading?: boolean;
    isError?: boolean;
    error?: ReactNode;
    disabled?: boolean;
}

const byName = (a: PickerMember, b: PickerMember) =>
    displayName(a).localeCompare(displayName(b), undefined, { sensitivity: 'base' });

const matches = (member: PickerMember, query: string) =>
    !query || displayName(member).toLowerCase().includes(query) || member.email.toLowerCase().includes(query);

/**
 * Search-and-check member selector (Figma "Add members"): chips in the field, a dropdown of
 * members who can join and, greyed out, those already in a team. An account is in at most
 * one team, so the second group is the server's 409 shown before the user can trigger it.
 */
export default function MemberPicker({
    label,
    members,
    value,
    onChange,
    isLoading,
    isError,
    error,
    disabled,
}: MemberPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const fieldRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const inputId = useId();
    const messageId = `${inputId}-message`;

    const query = search.trim().toLowerCase();
    const { available, unavailable } = useMemo(() => {
        const sorted = [...members].sort(byName);
        return {
            available: sorted.filter((member) => !member.team_id),
            unavailable: sorted.filter((member) => member.team_id),
        };
    }, [members]);
    const shownAvailable = available.filter((member) => matches(member, query));
    const shownUnavailable = unavailable.filter((member) => matches(member, query));
    const selected = available.filter((member) => value.includes(member.id));

    const toggle = (id: string) => {
        onChange(value.includes(id) ? value.filter((selectedId) => selectedId !== id) : [...value, id]);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && search === '' && selected.length > 0) {
            toggle(selected[selected.length - 1].id);
            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            listRef.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus();
        }
    };

    const renderList = () => {
        if (isLoading) return <p className='member-picker__state'>Loading members…</p>;
        if (isError) return <p className='member-picker__state'>Couldn't load members.</p>;
        if (shownAvailable.length === 0 && shownUnavailable.length === 0) {
            return (
                <p className='member-picker__state'>
                    {query ? 'No members match your search.' : 'No members in your company yet.'}
                </p>
            );
        }

        return (
            <>
                {shownAvailable.length > 0 && (
                    <div role='group' aria-label='Available members'>
                        <p className='member-picker__group'>Available members ({shownAvailable.length})</p>
                        {shownAvailable.map((member) => {
                            const checked = value.includes(member.id);
                            return (
                                <label
                                    key={member.id}
                                    className={clsx('member-picker__option', checked && 'member-picker__option--checked')}
                                >
                                    <MemberIdentity member={member} detail={member.email} />
                                    <input
                                        type='checkbox'
                                        className='member-picker__checkbox'
                                        checked={checked}
                                        onChange={() => toggle(member.id)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                )}
                {shownUnavailable.length > 0 && (
                    <div role='group' aria-label='Unavailable members'>
                        <p className='member-picker__group'>Unavailable members ({shownUnavailable.length})</p>
                        {shownUnavailable.map((member) => (
                            <div key={member.id} className='member-picker__option member-picker__option--unavailable'>
                                <MemberIdentity
                                    member={member}
                                    detail={member.team_name ? `${member.email} · ${member.team_name}` : member.email}
                                />
                                <input
                                    type='checkbox'
                                    className='member-picker__checkbox'
                                    checked
                                    disabled
                                    aria-label={`${displayName(member)} is already in a team`}
                                    readOnly
                                />
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    };

    return (
        <div className='ds-field-group'>
            <PopoverPrimitive.Root open={open && !disabled} onOpenChange={setOpen}>
                <PopoverPrimitive.Anchor asChild>
                    <FieldShell
                        ref={fieldRef}
                        label={label}
                        htmlFor={inputId}
                        disabled={disabled}
                        invalid={Boolean(error)}
                        className='member-picker__field'
                        data-state={open ? 'open' : 'closed'}
                        onClick={() => inputRef.current?.focus()}
                    >
                        <div className='member-picker__chips'>
                            {selected.map((member) => (
                                <span key={member.id} className='member-picker__chip'>
                                    {displayName(member)}
                                    <button
                                        type='button'
                                        className='member-picker__chip-remove'
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            toggle(member.id);
                                        }}
                                        disabled={disabled}
                                        tabIndex={-1}
                                        aria-label={`Remove ${displayName(member)}`}
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                            <input
                                ref={inputRef}
                                id={inputId}
                                type='text'
                                className='ds-field__input member-picker__input'
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setOpen(true);
                                }}
                                onFocus={() => setOpen(true)}
                                onKeyDown={handleKeyDown}
                                placeholder={open || selected.length === 0 ? 'Search by name or email…' : undefined}
                                disabled={disabled}
                                autoComplete='off'
                                aria-expanded={open}
                                aria-invalid={error ? true : undefined}
                                aria-describedby={error ? messageId : undefined}
                            />
                        </div>
                    </FieldShell>
                </PopoverPrimitive.Anchor>
                <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                        className='member-picker__content'
                        align='start'
                        sideOffset={4}
                        onOpenAutoFocus={(event) => event.preventDefault()}
                        onCloseAutoFocus={(event) => event.preventDefault()}
                        onInteractOutside={(event) => {
                            // Clicks in the field keep it open; the field owns focus and typing.
                            if (fieldRef.current?.contains(event.target as Node)) event.preventDefault();
                        }}
                    >
                        <div ref={listRef} className='member-picker__list'>
                            {renderList()}
                        </div>
                        <p className='member-picker__footer'>
                            {selected.length} {selected.length === 1 ? 'member' : 'members'} selected
                        </p>
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
            <FieldMessage id={messageId} error={error} />
        </div>
    );
}
