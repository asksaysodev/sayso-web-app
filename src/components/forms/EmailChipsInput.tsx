import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { LuX } from "react-icons/lu";
import "./styles/emailChipsInput.css";
import { useAuth } from "@/context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
    chips: string[];
    onChange: (chips: string[]) => void;
    disabled?: boolean;
    placeholder?: string;
    label?: string;
}

export default function EmailChipsInput({ chips, onChange, disabled, placeholder, label }: Props) {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { globalUser } = useAuth();
    
    const tryAddChip = (raw: string) => {
        const email = raw.trim().toLowerCase();
        if (!email) return;

        if (!EMAIL_REGEX.test(email)) {
            setError("Invalid email address");
            return;
        }

        if (chips.includes(email)) {
            setError("Email already added");
            return;
        }
        
        if (globalUser?.email && email === globalUser.email.trim().toLowerCase()) {
            setError("You can't invite yourself");
            return;
        }
        
        onChange([...chips, email]);
        setInputValue("");
        setError(null);
    };

    const removeChip = (index: number) => {
        onChange(chips.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === " " || e.key === "," || e.key === "Tab") {
            e.preventDefault();
            tryAddChip(inputValue);
        } else if (e.key === "Backspace" && inputValue === "") {
            removeChip(chips.length - 1);
        } else {
            setError(null);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text");
        const parts = pasted.split(/[\n\r\t,;]+/).map((p) => p.trim()).filter(Boolean);

        if (parts.length <= 1 && !pasted.includes(",")) return;

        e.preventDefault();
        const newChips = [...chips];
        let firstError: string | null = null;

        for (const part of parts) {
            const email = part.toLowerCase();
            if (!EMAIL_REGEX.test(email)) {
                if (!firstError) firstError = `"${email}" is not a valid email`;
                continue;
            }
            if (newChips.includes(email)) continue;
            if (globalUser?.email && email === globalUser.email.trim().toLowerCase()) {
                if (!firstError) firstError = "You can't invite yourself";
                continue;
            }
            newChips.push(email);
        }

        if (newChips.length > chips.length) {
            onChange(newChips);
            setInputValue("");
        }
        setError(firstError);
    };

    const handleBlur = () => {
        if (inputValue.trim()) {
            tryAddChip(inputValue);
        }
    };

    return (
        <div className="email-chips-input-wrapper">
            {label && (
                <label className="email-chips-input-label">{label}</label>
            )}
            <div
                className={`email-chips-input-container ${error ? "error" : ""} ${disabled ? "disabled" : ""}`}
                onClick={() => inputRef.current?.focus()}
            >
                {chips.map((email, i) => (
                    <span key={email} className="email-chip">
                        {email}
                        <button
                            type="button"
                            className="email-chip-remove"
                            onClick={(e) => { e.stopPropagation(); removeChip(i); }}
                            tabIndex={-1}
                        >
                            <LuX size={12} />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    className="email-chips-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onBlur={handleBlur}
                    placeholder={chips.length === 0 ? placeholder : ""}
                    disabled={disabled}
                />
            </div>
            {error && (
                <p className="email-chips-input-error">{error}</p>
            )}
        </div>
    );
}
