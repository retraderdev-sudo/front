'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Users, BarChart3, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PersianText } from '@/components/persian-text';
import { useLocalizedRouter } from '@/hooks/use-localized-router';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const localizedRouter = useLocalizedRouter();
  const t = useTranslations('admin');

  React.useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user?.role !== 'ADMIN') {
      router.push('/home');
      return;
    }
  }, [session, status, router]);

  const sidebarItems: SidebarItem[] = [
    {
      href: '/admin/dashboard',
      icon: BarChart3,
      label: t('dashboard'),
    },
    {
      href: '/admin/users',
      icon: Users,
      label: t('users'),
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: t('settings'),
    },
  ];

  const handleLogout = async () => {
    // You can implement logout logic here
    router.push('/login');
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null; // Will redirect
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-6">
          <h1 className="text-xl font-bold text-foreground">
            <PersianText>{t('adminPanel')}</PersianText>
          </h1>
          <p className="text-sm text-muted-foreground">
            <PersianText>{t('welcome')}</PersianText>
          </p>
        </div>

        <nav className="px-4 pb-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  <span>
                    <PersianText>{item.label}</PersianText>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-t border-border p-4">
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">
              {session.user?.email}
            </p>
            <p className="text-xs text-muted-foreground">
              <PersianText>{t('admin')}</PersianText>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <PersianText>{t('logout')}</PersianText>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
