import { useTranslations } from '@/shared/service/locale/use-translations';

export default function Home() {
  const t = useTranslations('home');
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-5xl font-bold">{t('title')}</h1>
    </main>
  );
}
