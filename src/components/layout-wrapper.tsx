'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import Footer from './footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Check if current route is an admin route
  const isAdminRoute = pathname.includes('/admin');

  // Check if current route should show header and footer (not admin routes)
  const shouldShowHeader = !isAdminRoute;

  return (
    <div className="min-h-screen bg-background">
      {shouldShowHeader && <Header />}
      <main className={shouldShowHeader ? '' : ''}>{children}</main>
      {shouldShowHeader && <Footer />}
    </div>
  );
}
