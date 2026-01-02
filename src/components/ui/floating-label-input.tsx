import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
    ({ className, label, value, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const hasValue = value && value.toString().length > 0;

        return (
            <div className="relative">
                <input
                    ref={ref}
                    value={value}
                    {...props}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    className={cn(
                        "block w-full rounded-md border-gray-300 px-3 pb-2 pt-5 text-sm text-gray-900 focus:border-black focus:ring-black/5 bg-white border shadow-sm outline-none transition-all duration-200 h-[50px]",
                        className
                    )}
                    placeholder=" "
                />
                <label
                    className={cn(
                        "absolute left-3 transition-all duration-200 pointer-events-none text-gray-500",
                        (isFocused || hasValue) ? "top-1.5 text-[11px] font-medium" : "top-3.5 text-sm"
                    )}
                >
                    {label}
                </label>
            </div>
        );
    }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
