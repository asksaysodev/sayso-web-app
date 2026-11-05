import { useState, type FormEvent } from 'react';
import { CalendarDays, Lock, Send } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { SegmentedControl } from '@/components/ds/SegmentedControl';
import { SelectField } from '@/components/ds/SelectField';
import { TextField } from '@/components/ds/TextField';
import { useSaveWorkshop, useSendWorkshopTest } from '../hooks/useWorkshops';
import { AdminWorkshop, WorkshopEmail, WorkshopInput, WorkshopStatus } from '../types';
import { WORKSHOP_EMAILS, emptyWorkshop, missingForReady, toFormValues } from '../utils/workshopForm';
import '../styles/WorkshopFormModal.css';

const STATUS_ITEMS: { value: WorkshopStatus; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'ready', label: 'Ready' },
];

interface Props {
    /** Omit to create a new workshop. */
    workshop?: AdminWorkshop;
    existing: AdminWorkshop[];
    onClose: () => void;
}

export default function WorkshopFormModal({ workshop, existing, onClose }: Props) {
    const [initial] = useState<WorkshopInput>(() => (workshop ? toFormValues(workshop) : emptyWorkshop(existing)));
    const [values, setValues] = useState<WorkshopInput>(initial);
    const [testEmail, setTestEmail] = useState<WorkshopEmail>('announce');
    const { saveWorkshop, isSaving } = useSaveWorkshop();
    const { sendTest, isSending } = useSendWorkshopTest();

    const locked = !!workshop?.locked;
    const disabled = locked || isSaving;
    const isDirty = JSON.stringify(values) !== JSON.stringify(initial);
    const problems = values.status === 'ready' ? missingForReady(values) : [];

    const set = <K extends keyof WorkshopInput>(key: K, value: WorkshopInput[K]) =>
        setValues(current => ({ ...current, [key]: value }));

    const setTakeaway = (index: number, value: string) =>
        set('takeaways', values.takeaways.map((takeaway, i) => (i === index ? value : takeaway)));

    const handleOpenChange = (open: boolean) => {
        if (!open && !isSaving) onClose();
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (locked || problems.length) return;
        saveWorkshop({ id: workshop?.id, input: values }, { onSuccess: onClose });
    };

    return (
        <Modal open onOpenChange={handleOpenChange} hideClose={isSaving} className='workshop-form-modal' aria-describedby={undefined}>
            <form onSubmit={handleSubmit}>
                <ModalHeader icon={<CalendarDays size={24} />} title={workshop ? 'Edit workshop' : 'New workshop'} />
                <ModalBody>
                    <div className='workshop-form'>
                        {locked && (
                            <p className='workshop-form__notice'>
                                <Lock size={18} aria-hidden='true' />
                                <span>An email has already gone out for this workshop, so it can no longer be edited.</span>
                            </p>
                        )}
                        <TextField
                            label='Date'
                            type='date'
                            value={values.date}
                            onChange={event => set('date', event.target.value)}
                            helperText='Workshops run on the second Thursday of the month.'
                            disabled={disabled}
                            required
                        />
                        <TextField
                            label='Title'
                            value={values.title}
                            onChange={event => set('title', event.target.value)}
                            placeholder='e.g. Handling the commission objection'
                            disabled={disabled}
                        />
                        <TextField
                            label='Hook'
                            value={values.hook}
                            onChange={event => set('hook', event.target.value)}
                            placeholder='One line on why it is worth attending'
                            disabled={disabled}
                        />
                        <label className='workshop-form__textarea'>
                            <span>Description</span>
                            <textarea
                                rows={4}
                                value={values.description}
                                onChange={event => set('description', event.target.value)}
                                disabled={disabled}
                            />
                        </label>
                        {values.takeaways.map((takeaway, index) => (
                            <TextField
                                key={index}
                                label={`Takeaway ${index + 1}`}
                                value={takeaway}
                                onChange={event => setTakeaway(index, event.target.value)}
                                disabled={disabled}
                            />
                        ))}
                        <TextField
                            label='Host (optional)'
                            value={values.host}
                            onChange={event => set('host', event.target.value)}
                            placeholder='e.g. Kuvaal Patel, Sayso'
                            disabled={disabled}
                        />
                        <TextField
                            label='Image URL (optional)'
                            value={values.imageUrl}
                            onChange={event => set('imageUrl', event.target.value)}
                            helperText='Recommended: 1024 × 512 px (2:1), JPG or PNG. Shown up to 512 px wide. Only appears in the announcement email.'
                            disabled={disabled}
                        />
                        <TextField
                            label='Google Meet link'
                            value={values.meetUrl}
                            onChange={event => set('meetUrl', event.target.value)}
                            disabled={disabled}
                        />

                        <div className='workshop-form__status'>
                            <span className='workshop-form__status-label'>Status</span>
                            <SegmentedControl
                                aria-label='Workshop status'
                                items={STATUS_ITEMS}
                                value={values.status}
                                onChange={value => {
                                    if (!disabled) set('status', value);
                                }}
                            />
                            <p className='workshop-form__hint'>Emails only use Ready workshops. Drafts stay private.</p>
                            {problems.length > 0 && (
                                <ul className='workshop-form__problems'>
                                    {problems.map(problem => <li key={problem}>{problem}</li>)}
                                </ul>
                            )}
                        </div>

                        {workshop && (
                            <div className='workshop-form__test'>
                                <SelectField
                                    label='Test email'
                                    options={WORKSHOP_EMAILS}
                                    value={testEmail}
                                    onChange={setTestEmail}
                                />
                                <Button
                                    variant='secondary'
                                    leftIcon={<Send size={16} />}
                                    onClick={() => sendTest({ id: workshop.id, variant: testEmail })}
                                    loading={isSending}
                                    disabled={isDirty}
                                >
                                    Send test to me
                                </Button>
                                {isDirty && <p className='workshop-form__hint'>Save your changes first. Tests use the saved workshop.</p>}
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant='secondary' onClick={onClose} disabled={isSaving}>
                        {locked ? 'Close' : 'Cancel'}
                    </Button>
                    {!locked && (
                        <Button type='submit' disabled={problems.length > 0 || !values.date || !isDirty} loading={isSaving}>
                            {isSaving ? 'Saving…' : 'Save'}
                        </Button>
                    )}
                </ModalFooter>
            </form>
        </Modal>
    );
}
