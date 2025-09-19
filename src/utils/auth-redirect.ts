import { useSession } from 'next-auth/react';
import { useLocalizedRouter } from '@/hooks/use-localized-router';
import { useEffect } from 'react';

export function useAuthRedirect() {
  const { data: session, status } = useSession();
  const router = useLocalizedRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (session?.user) {
      // User is authenticated, redirect based on role
      if (session.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/home');
      }
    }
  }, [session, status, router]);

  return { session, status };
}

export function getRedirectPath(userRole?: string): string {
  if (userRole === 'ADMIN') {
    return '/admin/dashboard';
  }
  return '/home';
}
