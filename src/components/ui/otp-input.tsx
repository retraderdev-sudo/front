'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error,
  className,
}: OtpInputProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return; // Only allow digits

    const newValue = value.split('');
    newValue[index] = inputValue;
    const updatedValue = newValue.join('').slice(0, length);

    onChange(updatedValue);

    // Move to next input if current input has a value
    if (inputValue && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all inputs are filled
    if (updatedValue.length === length) {
      onComplete?.(updatedValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);
    onChange(pastedData);

    if (pastedData.length === length) {
      onComplete?.(pastedData);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex justify-center gap-2">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            disabled={disabled}
            className={cn(
              'h-12 w-12 rounded-lg border-2 text-center text-lg font-semibold',
              'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary',
              'transition-colors duration-200',
              error
                ? 'border-red-500 bg-red-50'
                : activeIndex === index
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 bg-white hover:border-gray-400',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          />
        ))}
      </div>
      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </div>
  );
}
