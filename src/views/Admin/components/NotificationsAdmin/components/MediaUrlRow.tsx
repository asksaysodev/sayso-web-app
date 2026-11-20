import { X } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { TextField } from '@/components/ds/TextField';
import { isWebLink } from '@/components/NotificationWidget/helpers/isWebLink';
import { MediaFormItem } from '../types';

interface Props {
    item: MediaFormItem;
    index: number;
    onChange: (item: MediaFormItem) => void;
    onRemove?: () => void;
    disabled?: boolean;
}

/** One media URL, plus an optional preview image when it's a web link (not YouTube, Loom or a video). */
export default function MediaUrlRow({ item, index, onChange, onRemove, disabled }: Props) {
    const n = index + 1;
    const showPreview = !!item.url.trim() && isWebLink(item.url.trim());

    return (
        <div className='notification-form__media-item'>
            <div className='notification-form__url-row'>
                <TextField
                    label={index === 0 ? 'Media URL' : `Media URL ${n}`}
                    value={item.url}
                    onChange={event => onChange({ ...item, url: event.target.value })}
                    placeholder='YouTube or Loom link, video, image or web link'
                    disabled={disabled}
                />
                {onRemove && (
                    <Button variant='ghost' size='icon' aria-label={`Remove media URL ${n}`} onClick={onRemove} disabled={disabled}>
                        <X size={18} />
                    </Button>
                )}
            </div>
            {showPreview && (
                <TextField
                    label={index === 0 ? 'Preview image URL (optional)' : `Preview image URL ${n} (optional)`}
                    value={item.previewUrl}
                    onChange={event => onChange({ ...item, previewUrl: event.target.value })}
                    placeholder='https://…/preview.png'
                    helperText='Shown on top of the link card. Without it, an image URL shows as the image and a website as a link.'
                    disabled={disabled}
                />
            )}
        </div>
    );
}
