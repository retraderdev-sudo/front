'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  dir?: 'ltr' | 'rtl';
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  dir = 'ltr',
}: BottomSheetProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-out',
          'rounded-t-lg border-t border-border bg-background shadow-lg',
          'max-h-[80vh] overflow-y-auto',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        dir={dir}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}
