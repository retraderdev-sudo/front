'use client';

import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface PersianTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function PersianText({
  children,
  className,
  as: Component = 'span',
}: PersianTextProps) {
  const locale = useLocale();
  const isPersian = locale === 'fa';

  return (
    <Component className={cn(isPersian && 'font-persian', className)}>
      {children}
    </Component>
  );
}
