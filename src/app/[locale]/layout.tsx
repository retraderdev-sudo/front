import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LayoutWrapper } from '@/components/layout-wrapper';

const locales = ['en', 'fa'];

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LayoutWrapper>{children}</LayoutWrapper>
    </NextIntlClientProvider>
  );
}
