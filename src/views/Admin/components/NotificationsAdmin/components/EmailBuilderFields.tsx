import { ArrowDown, ArrowUp, Heading2, List, Pilcrow, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ds/Button';
import { TextField } from '@/components/ds/TextField';
import { EmailBlockType, EmailFormBlock, NotificationFormValues } from '../types';
import { BLOCK_LABELS, newBlock } from '../utils/emailContent';

interface Props {
    values: NotificationFormValues;
    set: <K extends keyof NotificationFormValues>(key: K, value: NotificationFormValues[K]) => void;
    disabled?: boolean;
}

const BLOCK_ICONS: Record<EmailBlockType, ReactNode> = {
    paragraph: <Pilcrow size={14} aria-hidden='true' />,
    heading: <Heading2 size={14} aria-hidden='true' />,
    list: <List size={14} aria-hidden='true' />,
};

const PLACEHOLDERS: Record<EmailBlockType, string> = {
    paragraph: 'Write a paragraph. Line breaks are kept, and links like https://asksayso.com work.',
    heading: 'e.g. What’s new',
    list: 'One item per line',
};

/**
 * The email builder (SAYSO-623): a title, body blocks and an optional button. The server
 * puts them in the regular Sayso template and adds the logo header and the footer, so
 * nobody writes HTML.
 */
export default function EmailBuilderFields({ values, set, disabled }: Props) {
    const blocks = values.emailBlocks;
    const setBlocks = (next: EmailFormBlock[]) => set('emailBlocks', next);
    const update = (id: string, text: string) => setBlocks(blocks.map(b => (b.id === id ? { ...b, text } : b)));
    const remove = (id: string) => setBlocks(blocks.filter(b => b.id !== id));
    const move = (index: number, by: -1 | 1) => {
        const next = [...blocks];
        [next[index], next[index + by]] = [next[index + by], next[index]];
        setBlocks(next);
    };

    return (
        <div className='email-builder'>
            <TextField
                label='Title'
                value={values.emailTitle}
                onChange={event => set('emailTitle', event.target.value)}
                placeholder='The big heading under the Sayso logo'
                disabled={disabled}
                maxLength={200}
            />

            <div className='email-builder__body'>
                <span className='notification-form__label'>Body</span>
                {blocks.length === 0 && <p className='notification-form__hint'>Add a paragraph or a list to start.</p>}
                <ol className='email-builder__blocks'>
                    {blocks.map((block, index) => (
                        <li key={block.id} className='email-builder__block'>
                            <div className='email-builder__block-head'>
                                <span className='email-builder__block-type'>
                                    {BLOCK_ICONS[block.type]}
                                    {BLOCK_LABELS[block.type]}
                                </span>
                                <div className='email-builder__block-actions'>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        aria-label={`Move ${BLOCK_LABELS[block.type].toLowerCase()} ${index + 1} up`}
                                        onClick={() => move(index, -1)}
                                        disabled={disabled || index === 0}
                                    >
                                        <ArrowUp size={16} />
                                    </Button>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        aria-label={`Move ${BLOCK_LABELS[block.type].toLowerCase()} ${index + 1} down`}
                                        onClick={() => move(index, 1)}
                                        disabled={disabled || index === blocks.length - 1}
                                    >
                                        <ArrowDown size={16} />
                                    </Button>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        aria-label={`Remove ${BLOCK_LABELS[block.type].toLowerCase()} ${index + 1}`}
                                        onClick={() => remove(block.id)}
                                        disabled={disabled}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                            {block.type === 'heading' ? (
                                <input
                                    className='email-builder__input email-builder__input--heading'
                                    aria-label={`Heading ${index + 1}`}
                                    value={block.text}
                                    onChange={event => update(block.id, event.target.value)}
                                    placeholder={PLACEHOLDERS.heading}
                                    disabled={disabled}
                                    maxLength={300}
                                />
                            ) : (
                                <textarea
                                    className='email-builder__input'
                                    aria-label={`${BLOCK_LABELS[block.type]} ${index + 1}`}
                                    rows={4}
                                    value={block.text}
                                    onChange={event => update(block.id, event.target.value)}
                                    placeholder={PLACEHOLDERS[block.type]}
                                    disabled={disabled}
                                />
                            )}
                        </li>
                    ))}
                </ol>
                <div className='email-builder__add'>
                    {(['paragraph', 'heading', 'list'] as EmailBlockType[]).map(type => (
                        <Button
                            key={type}
                            variant='ghost'
                            size='sm'
                            leftIcon={<Plus size={16} />}
                            onClick={() => setBlocks([...blocks, newBlock(type)])}
                            disabled={disabled || blocks.length >= 40}
                        >
                            {BLOCK_LABELS[type]}
                        </Button>
                    ))}
                </div>
            </div>

            <div className='email-builder__cta'>
                <span className='notification-form__label'>Button (optional)</span>
                <div className='email-builder__cta-fields'>
                    <TextField
                        label='Button text'
                        value={values.ctaLabel}
                        onChange={event => set('ctaLabel', event.target.value)}
                        placeholder='e.g. Read the guide'
                        disabled={disabled}
                        maxLength={60}
                    />
                    <TextField
                        label='Link'
                        type='url'
                        value={values.ctaUrl}
                        onChange={event => set('ctaUrl', event.target.value)}
                        placeholder='https://'
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
}
