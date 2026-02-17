import { cn } from "@/lib/utils";
import { InputGroupAddon, InputGroupInput } from "../ui/input-group";

import { InputGroup } from "../ui/input-group";

interface Props {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    size?: number;
    className?: string;
}

export default function SaysoInputGroup({ placeholder, value, onChange, icon, size, className }: Props) {
    return (
        <InputGroup className={cn("!h-10", className)}>
            <InputGroupInput
                size={size}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="!h-10"
            />
            <InputGroupAddon>
                {icon && icon}
            </InputGroupAddon>
        </InputGroup>
    );
}