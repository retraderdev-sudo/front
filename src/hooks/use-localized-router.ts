'use client';

import { useRouter } from 'next/navigation';
import { useLocalizedUrl } from './use-localized-url';

export function useLocalizedRouter() {
  const router = useRouter();
  const { getLocalizedUrl } = useLocalizedUrl();

  const push = (path: string) => {
    router.push(getLocalizedUrl(path));
  };

  const replace = (path: string) => {
    router.replace(getLocalizedUrl(path));
  };

  const back = () => {
    router.back();
  };

  const forward = () => {
    router.forward();
  };

  const refresh = () => {
    router.refresh();
  };

  return {
    push,
    replace,
    back,
    forward,
    refresh,
  };
}
