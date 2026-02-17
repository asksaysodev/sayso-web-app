import { PropsWithChildren, ReactNode } from 'react';
import './index.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Props extends PropsWithChildren {
    popoverContent: ReactNode
}

export default function SaysoPopover({ children, popoverContent }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className='sayso-outlined-button'>
                    {children}
                </button>
            </PopoverTrigger>
            <PopoverContent className='popover-content'>
                {popoverContent}
            </PopoverContent>
        </Popover>
    )
}