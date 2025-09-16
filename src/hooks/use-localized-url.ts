'use client';

import { useLocale } from 'next-intl';

export function useLocalizedUrl() {
  const locale = useLocale();

  const getLocalizedUrl = (path: string): string => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // If path already has locale prefix, return as is
    if (cleanPath.startsWith('en/') || cleanPath.startsWith('fa/')) {
      return `/${cleanPath}`;
    }

    // Add current locale prefix
    return `/${locale}/${cleanPath}`;
  };

  const getLocalizedPath = (path: string): string => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // If path already has locale prefix, return as is
    if (cleanPath.startsWith('en/') || cleanPath.startsWith('fa/')) {
      return cleanPath;
    }

    // Add current locale prefix
    return `${locale}/${cleanPath}`;
  };

  return {
    getLocalizedUrl,
    getLocalizedPath,
    locale,
  };
}
