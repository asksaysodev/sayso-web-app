import { Plus } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Checkbox } from '@/components/ds/Checkbox';
import { SegmentedControl } from '@/components/ds/SegmentedControl';
import { TextField } from '@/components/ds/TextField';
import RichTextEditor from '@/components/RichTextEditor';
import { NotificationType } from '../../../types';
import { MediaFormItem, NotificationFormValues } from '../types';
import { emptyMediaItem } from '../utils/notificationForm';
import MediaUrlRow from './MediaUrlRow';

const TYPE_ITEMS: { value: NotificationType; label: string }[] = [
    { value: 'media', label: 'Media' },
    { value: 'article', label: 'Article' },
];

interface Props {
    values: NotificationFormValues;
    set: <K extends keyof NotificationFormValues>(key: K, value: NotificationFormValues[K]) => void;
    disabled?: boolean;
}

/** The in-app notification's fields, with the same rules the tool always had. */
export default function InAppFields({ values, set, disabled }: Props) {
    const setMediaItem = (index: number, item: MediaFormItem) =>
        set('media', values.media.map((m, i) => (i === index ? item : m)));

    return (
        <div className='notification-form__group'>
            <TextField
                label='Title'
                value={values.title}
                onChange={event => set('title', event.target.value)}
                placeholder='e.g. New feature alert'
                disabled={disabled}
            />
            <TextField
                label='Description (optional)'
                value={values.description}
                onChange={event => set('description', event.target.value)}
                placeholder='Short subtitle shown below the title'
                disabled={disabled}
            />
            <div className='notification-form__inline'>
                <span className='notification-form__label'>Type</span>
                <SegmentedControl
                    aria-label='In-app notification type'
                    items={TYPE_ITEMS}
                    value={values.type}
                    onChange={value => {
                        if (!disabled) set('type', value);
                    }}
                />
            </div>

            {values.type === 'media' && (
                <div className='notification-form__group notification-form__group--tight'>
                    {values.media.map((item, index) => (
                        <MediaUrlRow
                            key={item.id}
                            item={item}
                            index={index}
                            onChange={next => setMediaItem(index, next)}
                            onRemove={index > 0 ? () => set('media', values.media.filter((_, i) => i !== index)) : undefined}
                            disabled={disabled}
                        />
                    ))}
                    <Button
                        variant='ghost'
                        size='sm'
                        leftIcon={<Plus size={16} />}
                        onClick={() => set('media', [...values.media, emptyMediaItem()])}
                        disabled={disabled}
                    >
                        Add another URL
                    </Button>
                </div>
            )}

            {values.type === 'article' && (
                <div className='notification-form__field'>
                    <span className='notification-form__label'>Body</span>
                    <RichTextEditor
                        value={values.body}
                        onChange={html => set('body', html)}
                        placeholder='Write the in-app article…'
                    />
                </div>
            )}

            <TextField
                className='notification-form__date'
                label='Expires on (optional, CT)'
                type='date'
                value={values.expiresDate}
                onChange={event => set('expiresDate', event.target.value)}
                helperText='It stops showing in the app from this date. Leave empty to keep it.'
                disabled={disabled}
            />
            <div className='notification-form__checks'>
                <Checkbox
                    label='Remindable'
                    checked={values.remindable}
                    onChange={event => {
                        set('remindable', event.target.checked);
                        if (event.target.checked) set('isWelcome', false);
                    }}
                    disabled={disabled}
                />
                <Checkbox
                    label='Welcome notification (shown first to users less than 3 days old)'
                    checked={values.isWelcome}
                    onChange={event => {
                        set('isWelcome', event.target.checked);
                        if (event.target.checked) set('remindable', false);
                    }}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
