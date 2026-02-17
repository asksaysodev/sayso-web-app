import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Signal } from "../types";
import ControlledInputField from "@/components/forms/ControlledInputField";
import ControlledTextareaField from "@/components/forms/ControlledTextareaField";
import ControlledSelectField from "@/components/forms/ControlledSelectField";
import { useState } from "react";
import { useAdminStore } from "@/store/adminStore";

interface Props {
    signalsLength: number;
    handleSubmitAddSignal: (data: Signal) => void;
}

export default function CreateSignalDialog({ signalsLength, handleSubmitAddSignal }: Props) {
    const leadyType = useAdminStore(state => state.leadType);
    const [open, setOpen] = useState(false);
    
    const { control, handleSubmit, reset } = useForm<Signal>({
        defaultValues: {
            id: '',
            name: '',
            description: '',
            instructions: '',
            lead_type: leadyType,
            priority: signalsLength + 1,
            threshold: 0.22
        }
    });

    const onSubmit = (data: Signal) => {
        handleSubmitAddSignal(data);
        setOpen(false);
        reset();
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (open) {
            reset({
                id: '',
                name: '',
                description: '',
                instructions: '',
                lead_type: leadyType,
                priority: signalsLength + 1,
                threshold: 0.22
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <div style={{ width: '100%',display: 'flex', justifyContent: 'flex-end' }}>
                <DialogTrigger asChild>
                    <Button variant="default" className="sayso-primary-button">Add Signal</Button>
                </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle>Add Signal</DialogTitle>
                        <DialogDescription>
                        Create a new signal. Click add signal when you&apos;re
                        done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <ControlledInputField
                            control={control}
                            name="name"
                            label="Name"
                            rules={{ required: "Name is required" }}
                            placeholder="Name"
                        />
                        <ControlledTextareaField 
                            control={control}
                            name="description"
                            label="Description"
                            rules={{ required: "Description is required" }}
                            placeholder="Description"
                            rows={2}
                            resize="none"
                            characterCounter
                            characterCounterType='signal_description'
                        />
                        <ControlledTextareaField 
                            control={control}
                            name="instructions"
                            label="Instructions"
                            rules={{ required: "Instructions are required" }}
                            placeholder="Instructions"
                            rows={2}
                            resize="none"
                            characterCounter
                            characterCounterType='signal_instructions'
                        />

                        <ControlledSelectField
                            control={control}
                            name="lead_type"
                            label="Lead Type"
                            rules={{ required: "Lead type is required" }}
                            placeholder="Select a lead type"
                            options={[
                                { value: "buyer", label: "Buyer" },
                                { value: "seller", label: "Seller" }
                            ]}
                            disabled={true}
                            className="sayso-outlined-button"
                        />
                      
                        <ControlledInputField
                            control={control}
                            name="priority"
                            label="Priority"
                            rules={{ 
                                required: "Priority is required",
                                min: { value: 1, message: "Priority must be at least 1" },
                                max: { value: signalsLength + 1, message: `Priority cannot exceed ${signalsLength + 1}` },
                                valueAsNumber: true
                            }}
                            placeholder="Priority"
                            type="number"
                        />
                       
                        <ControlledInputField
                            control={control}
                            name="threshold"
                            label="Threshold"
                            rules={{ 
                                required: "Threshold is required",
                                min: { value: 0, message: "Threshold must be at least 0" },
                                max: { value: 2, message: "Threshold cannot exceed 2" },
                                valueAsNumber: true
                            }}
                            placeholder="Threshold"
                            type="number"
                            step="0.01"
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                        <Button variant="outline" className="sayso-outlined-button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="sayso-primary-button">Add Signal</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}