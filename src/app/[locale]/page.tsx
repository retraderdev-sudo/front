import { redirect } from 'next/navigation';

export default function LocalePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Redirect to home page for the locale
  redirect(`/${locale}/home`);
}
