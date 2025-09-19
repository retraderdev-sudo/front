'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Users, BarChart3, TrendingUp, Activity } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PersianText } from '@/components/persian-text';

export default function AdminDashboard() {
  const t = useTranslations('admin');

  const stats = [
    {
      title: t('totalUsers'),
      value: '1,234',
      description: t('totalUsersDesc'),
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: t('activeUsers'),
      value: '892',
      description: t('activeUsersDesc'),
      icon: Activity,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: t('totalRevenue'),
      value: '$45,231',
      description: t('totalRevenueDesc'),
      icon: TrendingUp,
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      title: t('conversionRate'),
      value: '3.2%',
      description: t('conversionRateDesc'),
      icon: BarChart3,
      change: '-2%',
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          <PersianText>{t('dashboard')}</PersianText>
        </h1>
        <p className="text-muted-foreground">
          <PersianText>{t('dashboardDescription')}</PersianText>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <PersianText>{stat.title}</PersianText>
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <PersianText>{stat.description}</PersianText>
              </p>
              <div className="mt-2 flex items-center text-xs">
                <span
                  className={
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1 text-muted-foreground">
                  {t('fromLastMonth')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <PersianText>{t('recentActivity')}</PersianText>
            </CardTitle>
            <CardDescription>
              <PersianText>{t('recentActivityDesc')}</PersianText>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <PersianText>{t(`activity${i}`)}</PersianText>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('timeAgo', { minutes: i * 5 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <PersianText>{t('quickActions')}</PersianText>
            </CardTitle>
            <CardDescription>
              <PersianText>{t('quickActionsDesc')}</PersianText>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="rounded-lg border p-3 hover:bg-accent">
                <p className="text-sm font-medium">
                  <PersianText>{t('viewUsers')}</PersianText>
                </p>
                <p className="text-xs text-muted-foreground">
                  <PersianText>{t('viewUsersDesc')}</PersianText>
                </p>
              </div>
              <div className="rounded-lg border p-3 hover:bg-accent">
                <p className="text-sm font-medium">
                  <PersianText>{t('systemSettings')}</PersianText>
                </p>
                <p className="text-xs text-muted-foreground">
                  <PersianText>{t('systemSettingsDesc')}</PersianText>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
