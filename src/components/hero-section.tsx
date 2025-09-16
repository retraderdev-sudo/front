'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useColorAnimation } from '@/hooks/use-color-animation';
import { PersianText } from '@/components/persian-text';

export function HeroSection() {
  const t = useTranslations('wallet.hero');
  const locale = useLocale();
  const { textClasses, buttonClasses } = useColorAnimation();

  const isRTL = locale === 'fa';

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Title */}
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            <PersianText as="span" className="block text-foreground">
              {t('title')}
            </PersianText>
            <PersianText as="span" className={`block ${textClasses} mt-2`}>
              {t('highlight')}
            </PersianText>
          </h1>

          {/* Subtitle */}
          <PersianText
            as="p"
            className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t('subtitle')}
          </PersianText>

          {/* Connect Wallet Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className={`${buttonClasses} px-8 py-4 text-lg font-semibold text-white shadow-xl transition-transform duration-300 hover:scale-105`}
            >
              <PersianText>{t('connectButton')}</PersianText>
            </Button>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-foreground md:text-4xl">
                $18B
              </div>
              <PersianText className="mt-2 text-sm text-muted-foreground">
                {isRTL ? 'حجم معاملات' : 'Trading Volume'}
              </PersianText>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-foreground md:text-4xl">
                $112.6M
              </div>
              <PersianText className="mt-2 text-sm text-muted-foreground">
                {isRTL ? 'ارزش کل قفل شده' : 'Total Value Locked'}
              </PersianText>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-foreground md:text-4xl">
                2.9M
              </div>
              <PersianText className="mt-2 text-sm text-muted-foreground">
                {isRTL ? 'تعداد معاملات' : 'Total Trades'}
              </PersianText>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
