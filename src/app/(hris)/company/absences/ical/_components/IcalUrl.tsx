'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { useToast } from '@/lib/ui/hooks';
import { ABSENCE_TOASTS } from '@/shared/constants/toast-notifications';
import { Icon } from '@/lib/ui/components/icon';

interface IcalUrlProps {
  url: string;
  translationBaseKey: string;
}

export function IcalUrl({ url, translationBaseKey }: IcalUrlProps) {
  const t = useTranslations(translationBaseKey);
  const tNext = useNextTranslations(translationBaseKey);
  const toast = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    toast(ABSENCE_TOASTS.COPY_TO_CLIPBOARD);
  };

  return (
    <div className="relative">
      <div className="mb-4">
        <p className="mb-2 text-sm text-gray-500">{t('calendarExportDescription')}</p>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="calendar-export">
          {t('linkToExportCalendar')}
        </label>
      </div>
      <div className="relative w-[70%]">
        <input
          readOnly
          className="w-full rounded-md border bg-gray-50 px-4 py-2 pr-12"
          id="calendar-export"
          type="text"
          value={url}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title={tNext('copyToClipboard')}
          onClick={handleCopy}
        >
          <Icon name="copy" size={16} />
        </button>
      </div>
    </div>
  );
}
