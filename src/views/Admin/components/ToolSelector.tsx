import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tool } from '../types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"

interface Props {
    selectedTool: Tool;
    setSelectedTool: (tool: Tool) => void;
}

const tools: { value: Tool, label: string }[] = [
    {
      value: "cue-signals",
      label: "Cue Signals",
    },
    // {
    //   value: "cue-main-instructions",
    //   label: "Cue Main Instructions",
    // },
  ]


export default function ToolSelector({ selectedTool, setSelectedTool }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className='tool-selector-container'>
            <label>Tool Selector</label>
            <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full lg:w-[200px] justify-between !h-10"
                style={{ border: '1px solid var(--sayso-border)' }}
                >
                {selectedTool
                    ? tools.find((tool) => tool.value === selectedTool)?.label
                    : "Select a Tool..."}
                <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full lg:w-[200px] p-0">
                <Command>
                <CommandInput placeholder="Search a Tool..." className="h-9" />
                <CommandList>
                    <CommandEmpty>No Tool found.</CommandEmpty>
                    <CommandGroup>
                    {tools.map((tool) => (
                        <CommandItem
                        key={tool.value}
                        value={tool.value}
                        onSelect={(currentValue) => {
                            if (currentValue === selectedTool) return;
                            setSelectedTool(currentValue as Tool)
                            setOpen(false)
                        }}
                        >
                        {tool.label}
                        <Check
                            className={cn(
                            "ml-auto",
                            selectedTool === tool.value ? "opacity-100" : "opacity-0"
                            )}
                        />
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
            </Popover>
        </div>
      )
}
