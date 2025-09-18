'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
    className?: string;
}

interface AccordionProps {
    children: React.ReactNode;
    className?: string;
    allowMultiple?: boolean;
}

const AccordionContext = React.createContext<{
    allowMultiple: boolean;
    openItems: Set<string>;
    toggleItem: (id: string) => void;
}>({
    allowMultiple: false,
    openItems: new Set(),
    toggleItem: () => { },
});

export function Accordion({
    children,
    className,
    allowMultiple = false,
}: AccordionProps) {
    const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

    const toggleItem = React.useCallback(
        (id: string) => {
            setOpenItems((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(id)) {
                    newSet.delete(id);
                } else {
                    if (!allowMultiple) {
                        newSet.clear();
                    }
                    newSet.add(id);
                }
                return newSet;
            });
        },
        [allowMultiple]
    );

    return (
        <AccordionContext.Provider value={{ allowMultiple, openItems, toggleItem }}>
            <div className={cn('space-y-2', className)}>{children}</div>
        </AccordionContext.Provider>
    );
}

export function AccordionItem({
    title,
    children,
    className,
    id,
}: AccordionItemProps & { id: string }) {
    const { openItems, toggleItem } = React.useContext(AccordionContext);
    const isOpen = openItems.has(id);

    return (
        <div className={cn('rounded-lg border border-border', className)}>
            <button
                onClick={() => toggleItem(id)}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-accent/50"
                aria-expanded={isOpen}
            >
                <span className="font-medium text-foreground">{title}</span>
                <ChevronDown
                    className={cn(
                        'h-4 w-4 text-muted-foreground transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>
            <div
                className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                <div className="px-4 pb-3 text-muted-foreground">{children}</div>
            </div>
        </div>
    );
}
