import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SaysoButton from "@/components/SaysoButton";
import ControlledInputField from "@/components/forms/ControlledInputField";
import ControlledSelectField from "@/components/forms/ControlledSelectField";
import ControlledCustomFormField from "@/components/forms/ControlledCustomFormField";
import RichTextEditor from "@/components/RichTextEditor";

import { createNotification } from "../../services/notificationService";
import { NotificationType } from "../../types";
import { cn } from "@/lib/utils";

interface CreateNotificationForm {
    title: string;
    description: string;
    type: NotificationType;
    media_url: string;
    body: string;
    remindable: boolean;
    is_welcome: boolean;
    active: boolean;
    expires_at: Date | null;
}

const DEFAULT_VALUES: CreateNotificationForm = {
    title: '',
    description: '',
    type: 'media',
    media_url: '',
    body: '',
    remindable: false,
    is_welcome: false,
    active: true,
    expires_at: null,
};

export default function CreateNotificationButton() {
    const [open, setOpen] = useState(false);
    const [extraUrls, setExtraUrls] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const { control, handleSubmit, watch, reset, setValue } = useForm<CreateNotificationForm>({
        defaultValues: DEFAULT_VALUES,
    });

    const type = watch('type');

    const { mutate: create, isPending } = useMutation({
        mutationFn: (data: CreateNotificationForm) => {
            const allUrls = data.type === 'media'
                ? [data.media_url, ...extraUrls].map(u => u.trim()).filter(Boolean)
                : null;
            return createNotification({
                title: data.title,
                description: data.description || null,
                type: data.type,
                media_url: allUrls && allUrls.length > 0 ? allUrls : null,
                body: data.type === 'article' ? (data.body || null) : null,
                remindable: data.remindable,
                is_welcome: data.is_welcome,
                active: data.active,
                expires_at: data.expires_at ? data.expires_at.toISOString() : null,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-notifications-bulk'] });
            reset(DEFAULT_VALUES);
            setExtraUrls([]);
            setOpen(false);
        },
    });

    function handleOpenChange(next: boolean) {
        setOpen(next);
        if (!next) {
            reset(DEFAULT_VALUES);
            setExtraUrls([]);
        }
    }

    const onSubmit = handleSubmit((data) => create(data));

    return (
        <>
            <SaysoButton label="Create Notification" onClick={() => setOpen(true)} />

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-lg flex flex-col max-h-[85vh] pb-0">
                    <DialogHeader>
                        <DialogTitle>Create Notification</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="flex flex-col gap-5 overflow-y-auto pb-6">
                        <ControlledInputField
                            name="title"
                            control={control}
                            label="Title"
                            labelRequired
                            placeholder="e.g. New feature alert"
                            rules={{ required: 'Title is required' }}
                        />

                        <ControlledInputField
                            name="description"
                            control={control}
                            label="Description"
                            placeholder="Short subtitle shown below the title"
                        />

                        <ControlledSelectField
                            name="type"
                            control={control}
                            label="Type"
                            labelRequired
                            options={[
                                { value: 'media', label: 'Media' },
                                { value: 'article', label: 'Article' },
                            ]}
                        />

                        {type === 'media' && (
                            <div className="flex flex-col gap-2">
                                <ControlledInputField
                                    name="media_url"
                                    control={control}
                                    label="Media URL"
                                    labelRequired
                                    placeholder="YouTube link, video or image URL"
                                    rules={{ required: 'Media URL is required' }}
                                />
                                {extraUrls.map((url, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={e => setExtraUrls(prev => prev.map((u, j) => j === i ? e.target.value : u))}
                                            placeholder="YouTube link, video or image URL"
                                            className="flex-1 px-3 py-[10px] border border-[var(--sayso-border)] rounded-md text-sm bg-white transition-colors hover:border-[var(--sayso-indigo)] focus:border-[var(--sayso-indigo)] focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setExtraUrls(prev => prev.filter((_, j) => j !== i))}
                                            className="p-1 text-zinc-400 hover:text-zinc-700 transition-colors"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setExtraUrls(prev => [...prev, ''])}
                                    className="flex items-center gap-1 text-xs text-[var(--sayso-indigo)] hover:opacity-80 transition-opacity w-fit"
                                >
                                    <Plus size={13} /> Add another URL
                                </button>
                            </div>
                        )}

                        {type === 'article' && (
                            <ControlledCustomFormField
                                name="body"
                                control={control}
                                label="Body"
                                required
                                rules={{ validate: (v: string) => (v && v !== '<p></p>') || 'Body is required' }}
                            >
                                {({ field }) => (
                                    <RichTextEditor
                                        value={field.value as string}
                                        onChange={field.onChange}
                                        placeholder="Write your article content…"
                                    />
                                )}
                            </ControlledCustomFormField>
                        )}

                        <ControlledCustomFormField
                            name="expires_at"
                            control={control}
                            label="Expires at"
                        >
                            {({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "w-full flex items-center gap-2 px-3 py-[10px] border border-[var(--sayso-border)] rounded-md",
                                                "text-sm bg-white text-left transition-colors",
                                                "hover:border-[var(--sayso-indigo)] focus:border-[var(--sayso-indigo)] focus:outline-none",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="h-4 w-4 opacity-50 shrink-0" />
                                            {field.value ? format(field.value as Date, 'PPP') : 'Pick a date'}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value as Date ?? undefined}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        </ControlledCustomFormField>

                        <ControlledCustomFormField name="remindable" control={control}>
                                {({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="remindable"
                                            checked={field.value as boolean}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked);
                                                if (checked) setValue('is_welcome', false);
                                            }}
                                        />
                                        <Label htmlFor="remindable" className="cursor-pointer text-sm font-medium">
                                            Remindable
                                        </Label>
                                    </div>
                                )}
                            </ControlledCustomFormField>

                        <ControlledCustomFormField name="is_welcome" control={control}>
                                {({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="is_welcome"
                                            checked={field.value as boolean}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked);
                                                if (checked) setValue('remindable', false);
                                            }}
                                        />
                                        <Label htmlFor="is_welcome" className="cursor-pointer text-sm font-medium">
                                            Welcome notification
                                        </Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="flex items-center justify-center w-4 h-4 rounded-full border border-zinc-300 text-zinc-400 text-[10px] font-semibold cursor-default leading-none">?</span>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-[220px] bg-white text-zinc-800 border border-zinc-200 shadow-sm text-center">
                                                    Shown first to new users (less than 3 days old) before other notifications. Useful for onboarding content.
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                            </ControlledCustomFormField>

                        <DialogFooter className="pt-2">
                            <SaysoButton
                                label="Cancel"
                                type="button"
                                variant="outlined"
                                onClick={() => handleOpenChange(false)}
                            />
                            <SaysoButton
                                label="Create"
                                type="submit"
                                loading={isPending}
                            />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
