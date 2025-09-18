'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/hero-section';
import { FAQSection } from '@/components/faq-section';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  const t = useTranslations('home');
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Visible to all users */}
      <HeroSection />

      {/* Features Section - Only show if user is logged in */}
      {session && (
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold">{t('welcome')}</h2>
              <p className="text-lg text-muted-foreground">
                {t('description')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>{t('features.trading.title')}</CardTitle>
                  <CardDescription>
                    {t('features.trading.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    {t('features.trading.button')}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('features.portfolio.title')}</CardTitle>
                  <CardDescription>
                    {t('features.portfolio.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    {t('features.portfolio.button')}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('features.analytics.title')}</CardTitle>
                  <CardDescription>
                    {t('features.analytics.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="secondary">
                    {t('features.analytics.button')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t('userInfo.title')}</CardTitle>
                <CardDescription>{t('userInfo.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      ID
                    </label>
                    <p className="text-lg">{session?.user?.id || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-lg">{session?.user?.email || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* FAQ Section - Visible to all users */}
      <FAQSection />
    </div>
  );
}
