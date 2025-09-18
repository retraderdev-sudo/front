'use client';

import * as React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { PersianText } from '@/components/persian-text';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { useLocalizedRouter } from '@/hooks/use-localized-router';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { data: session, status } = useSession();
  const t = useTranslations('header');
  const tAuth = useTranslations('auth');
  const locale = useLocale();
  const router = useLocalizedRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isRTL = locale === 'fa';

  const navigationItems = [
    { key: 'home', href: '/home' },
    { key: 'plans', href: '/plans' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
    { key: 'latest', href: '/latest' },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="container mx-auto px-4">
          <div
            className={`flex h-16 items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {/* Logo and Navigation */}
            <div
              className={`flex items-center ${isRTL ? 'space-x-8 space-x-reverse' : 'space-x-8'}`}
            >
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-2 text-xl font-bold"
              >
                <PersianText>{t('logo')}</PersianText>
              </Link>

              {/* Desktop Navigation */}
              <nav
                className={`hidden items-center md:flex ${isRTL ? 'space-x-6 space-x-reverse' : 'space-x-6'}`}
              >
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <PersianText>{t(`navigation.${item.key}`)}</PersianText>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Desktop Actions */}
            <div
              className={`hidden items-center md:flex ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}
            >
              <ThemeToggle />
              <LanguageSwitcher />
              {session ? (
                <Button variant="outline" onClick={handleLogout}>
                  {tAuth('logout')}
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">{tAuth('login')}</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">{tAuth('register')}</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div
              className={`flex items-center md:hidden ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}
            >
              <ThemeToggle />
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                className="h-9 w-9"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('menu')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Sheet */}
      <BottomSheet
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        title={t('menu')}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="space-y-4">
          {/* Navigation Items */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={closeMobileMenu}
                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {t(`navigation.${item.key}`)}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="border-t border-border pt-4">
            {session ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {session.user?.email}
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  {tAuth('logout')}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link href="/login" onClick={closeMobileMenu}>
                    {tAuth('login')}
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start">
                  <Link href="/signup" onClick={closeMobileMenu}>
                    {tAuth('register')}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
