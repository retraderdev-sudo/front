'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Save, RefreshCw } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PersianText } from '@/components/persian-text';

export default function AdminSettings() {
  const t = useTranslations('admin');
  const [settings, setSettings] = React.useState({
    siteName: 'Retrader',
    siteDescription: 'Advanced Trading Platform',
    maxUsers: '10000',
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
  });

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving settings:', settings);
  };

  const handleReset = () => {
    // Implement reset logic here
    console.log('Resetting settings');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          <PersianText>{t('settings')}</PersianText>
        </h1>
        <p className="text-muted-foreground">
          <PersianText>{t('settingsDescription')}</PersianText>
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            <PersianText>{t('generalSettings')}</PersianText>
          </CardTitle>
          <CardDescription>
            <PersianText>{t('generalSettingsDesc')}</PersianText>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              <PersianText>{t('siteName')}</PersianText>
            </label>
            <Input
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              placeholder={t('siteNamePlaceholder')}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              <PersianText>{t('siteDescription')}</PersianText>
            </label>
            <Input
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings({ ...settings, siteDescription: e.target.value })
              }
              placeholder={t('siteDescriptionPlaceholder')}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              <PersianText>{t('maxUsers')}</PersianText>
            </label>
            <Input
              type="number"
              value={settings.maxUsers}
              onChange={(e) =>
                setSettings({ ...settings, maxUsers: e.target.value })
              }
              placeholder="10000"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            <PersianText>{t('systemSettings')}</PersianText>
          </CardTitle>
          <CardDescription>
            <PersianText>{t('systemSettingsDesc')}</PersianText>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">
                <PersianText>{t('maintenanceMode')}</PersianText>
              </h4>
              <p className="text-sm text-muted-foreground">
                <PersianText>{t('maintenanceModeDesc')}</PersianText>
              </p>
            </div>
            <Button
              variant={settings.maintenanceMode ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setSettings({
                  ...settings,
                  maintenanceMode: !settings.maintenanceMode,
                })
              }
            >
              {settings.maintenanceMode ? t('enabled') : t('disabled')}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">
                <PersianText>{t('emailNotifications')}</PersianText>
              </h4>
              <p className="text-sm text-muted-foreground">
                <PersianText>{t('emailNotificationsDesc')}</PersianText>
              </p>
            </div>
            <Button
              variant={settings.emailNotifications ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setSettings({
                  ...settings,
                  emailNotifications: !settings.emailNotifications,
                })
              }
            >
              {settings.emailNotifications ? t('enabled') : t('disabled')}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">
                <PersianText>{t('autoBackup')}</PersianText>
              </h4>
              <p className="text-sm text-muted-foreground">
                <PersianText>{t('autoBackupDesc')}</PersianText>
              </p>
            </div>
            <Button
              variant={settings.autoBackup ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setSettings({ ...settings, autoBackup: !settings.autoBackup })
              }
            >
              {settings.autoBackup ? t('enabled') : t('disabled')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          <PersianText>{t('reset')}</PersianText>
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          <PersianText>{t('saveChanges')}</PersianText>
        </Button>
      </div>
    </div>
  );
}
