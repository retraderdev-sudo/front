'use client';

import Link from 'next/link';
import { useLocalizedUrl } from '@/hooks/use-localized-url';

interface LocalizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function LocalizedLink({
  href,
  children,
  className,
}: LocalizedLinkProps) {
  const { getLocalizedUrl } = useLocalizedUrl();

  return (
    <Link href={getLocalizedUrl(href)} className={className}>
      {children}
    </Link>
  );
}
