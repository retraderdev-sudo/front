'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { Home, Gift, Package, Wallet } from 'lucide-react';

import { useLocalizedRouter } from '@/hooks/use-localized-router';
import { PersianText } from '@/components/persian-text';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================
interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface MobileNavItem {
  href: string;
  icon: React.ComponentType<{ className?: string; 'aria-label'?: string }>;
  label: string;
}

// ============================================================================
// MOBILE NAVIGATION COMPONENT
// ============================================================================
const MobileNavigation: React.FC<{ t: (key: string) => string }> = React.memo(
  ({ t }) => {
    const navItems: MobileNavItem[] = useMemo(
      () => [
        { href: '/home', icon: Home, label: t('home') },
        { href: '/plans', icon: Gift, label: t('plans') },
        { href: '/wallet', icon: Wallet, label: t('wallet') },
        { href: '/latest', icon: Package, label: t('latest') },
      ],
      [t]
    );

    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background shadow-md md:hidden">
        <ul className="flex items-center justify-around py-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex flex-col items-center text-muted-foreground transition-colors hover:text-primary"
              >
                <div className="h-6 w-6">
                  <item.icon
                    className="h-full w-full"
                    aria-label={item.label}
                  />
                </div>
                <span className="mt-1 text-xs">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

MobileNavigation.displayName = 'MobileNavigation';

// ============================================================================
// FOOTER SECTION COMPONENT
// ============================================================================
const FooterSection: React.FC<FooterSection> = React.memo(
  ({ title, links }) => (
    <div>
      <h3 className="mb-4 text-sm font-bold text-foreground">
        <PersianText>{title}</PersianText>
      </h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
            >
              <PersianText>{link.label}</PersianText>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
);

FooterSection.displayName = 'FooterSection';

// ============================================================================
// AUTHENTICATED LINKS COMPONENT
// ============================================================================
const AuthenticatedLinks: React.FC<{
  t: (key: string) => string;
  onLogout: () => void;
}> = React.memo(({ t, onLogout }) => (
  <>
    <li>
      <Link
        href="/home"
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <PersianText>{t('myAccount')}</PersianText>
      </Link>
    </li>
    <li>
      <Link
        href="/wallet"
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <PersianText>{t('myWallet')}</PersianText>
      </Link>
    </li>
    <li>
      <button
        onClick={onLogout}
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <PersianText>{t('logout')}</PersianText>
      </button>
    </li>
  </>
));

AuthenticatedLinks.displayName = 'AuthenticatedLinks';

// ============================================================================
// UNAUTHENTICATED LINKS COMPONENT
// ============================================================================
const UnauthenticatedLinks: React.FC<{ t: (key: string) => string }> =
  React.memo(({ t }) => (
    <>
      <li>
        <Link
          href="/login"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <PersianText>{t('login')}</PersianText>
        </Link>
      </li>
      <li>
        <Link
          href="/signup"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <PersianText>{t('register')}</PersianText>
        </Link>
      </li>
    </>
  ));

UnauthenticatedLinks.displayName = 'UnauthenticatedLinks';

// ============================================================================
// ACCOUNT SECTION COMPONENT
// ============================================================================
const AccountSection: React.FC<{
  t: (key: string) => string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isClient: boolean;
  onLogout: () => void;
}> = React.memo(({ t, isAuthenticated, isLoading, isClient, onLogout }) => {
  if (!isClient) {
    return (
      <div>
        <h3 className="mb-4 text-sm font-bold text-foreground">
          <PersianText>{t('account')}</PersianText>
        </h3>
        <div className="animate-pulse">
          <div className="mb-2 h-4 w-3/4 rounded bg-muted"></div>
          <div className="h-4 w-1/2 rounded bg-muted"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold text-foreground">
        <PersianText>{t('account')}</PersianText>
      </h3>
      <ul className="space-y-2">
        {!isLoading &&
          (isAuthenticated ? (
            <AuthenticatedLinks t={t} onLogout={onLogout} />
          ) : (
            <UnauthenticatedLinks t={t} />
          ))}
      </ul>
    </div>
  );
});

AccountSection.displayName = 'AccountSection';

// ============================================================================
// FOOTER BOTTOM COMPONENT
// ============================================================================
const FooterBottom: React.FC<{ t: (key: string) => string }> = React.memo(
  ({ t }) => (
    <div className="mb-[50px] mt-0 flex flex-col items-center border-t-0 border-border pt-0 text-center md:mb-0 md:mt-8 md:border-t md:pt-6">
      <Link href="/" className="mb-4">
        <div className="text-2xl font-bold text-foreground">
          <PersianText>{t('logo')}</PersianText>
        </div>
      </Link>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} <PersianText>{t('retrader')}</PersianText>
        . <PersianText>{t('allRightsReserved')}</PersianText>
      </p>
    </div>
  )
);

FooterBottom.displayName = 'FooterBottom';

// ============================================================================
// MAIN FOOTER COMPONENT
// ============================================================================
const Footer: React.FC = () => {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations('footer');
  const tAuth = useTranslations('auth');
  const tHeader = useTranslations('header');
  const locale = useLocale();
  const router = useLocalizedRouter();

  const isRTL = locale === 'fa';

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

  // Memoize footer sections to prevent unnecessary re-renders
  const footerSections = useMemo(
    (): FooterSection[] => [
      {
        title: t('explore'),
        links: [
          { href: '/plans', label: t('plans') },
          { href: '/latest', label: t('latest') },
        ],
      },
      {
        title: t('about'),
        links: [
          { href: '/about', label: t('aboutUs') },
          { href: '/contact', label: t('contactSupport') },
        ],
      },
      {
        title: t('legal'),
        links: [
          { href: '/terms', label: t('termsConditions') },
          { href: '/faq', label: t('faqs') },
        ],
      },
    ],
    [t]
  );

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNavigation t={t} />

      {/* Desktop Footer */}
      <footer
        className="mt-4 border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="container mx-auto">
          <div className="hidden grid-cols-2 gap-6 sm:grid-cols-2 md:grid lg:grid-cols-4">
            {/* Account Section */}
            <AccountSection
              t={tAuth}
              isAuthenticated={!!session}
              isLoading={status === 'loading'}
              isClient={isClient}
              onLogout={handleLogout}
            />

            {/* Other Footer Sections */}
            {footerSections.map((section, index) => (
              <FooterSection key={index} {...section} />
            ))}
          </div>

          {/* Footer Bottom */}
          <FooterBottom t={t} />
        </div>
      </footer>
    </>
  );
};

export default Footer;
