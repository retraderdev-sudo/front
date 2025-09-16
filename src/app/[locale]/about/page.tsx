'use client';

import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AboutPage() {
  const t = useTranslations('header');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">{t('navigation.about')}</h1>
          <p className="text-lg text-muted-foreground">
            Learn more about Retrader and our mission to provide the best
            trading experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Empowering traders with advanced tools and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe in democratizing access to professional-grade trading
                tools and market insights for traders of all levels.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
              <CardDescription>The future of trading is here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To become the leading platform that bridges the gap between
                traditional and digital asset trading.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
