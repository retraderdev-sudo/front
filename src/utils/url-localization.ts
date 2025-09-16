export function getLocalizedUrl(path: string, locale: string = 'en'): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // If path already has locale prefix, return as is
  if (cleanPath.startsWith('en/') || cleanPath.startsWith('fa/')) {
    return `/${cleanPath}`;
  }

  // Add locale prefix
  return `/${locale}/${cleanPath}`;
}

export function extractLocaleFromPath(pathname: string): string {
  const localeMatch = pathname.match(/^\/([a-z]{2})\//);
  return localeMatch ? localeMatch[1] : 'en';
}

export function isLocalizedPath(pathname: string): boolean {
  return /^\/(en|fa)\//.test(pathname);
}
