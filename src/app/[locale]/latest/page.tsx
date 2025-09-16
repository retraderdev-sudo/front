'use client';

import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LatestPage() {
  const t = useTranslations('header');

  const latestItems = [
    {
      id: 1,
      title: 'New Trading Features Released',
      description:
        'Advanced charting tools and real-time market data now available',
      date: '2024-01-15',
      category: 'Features',
    },
    {
      id: 2,
      title: 'Mobile App Update',
      description:
        'Enhanced mobile experience with improved navigation and performance',
      date: '2024-01-10',
      category: 'Mobile',
    },
    {
      id: 3,
      title: 'Security Enhancements',
      description:
        'New security measures implemented to protect your trading account',
      date: '2024-01-05',
      category: 'Security',
    },
    {
      id: 4,
      title: 'Market Analysis Tools',
      description:
        'Advanced analytics and market insights now available for all users',
      date: '2024-01-01',
      category: 'Analytics',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">{t('navigation.latest')}</h1>
          <p className="text-lg text-muted-foreground">
            Stay updated with the latest news, features, and updates from
            Retrader.
          </p>
        </div>

        <div className="space-y-6">
          {latestItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Published on {new Date(item.date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
