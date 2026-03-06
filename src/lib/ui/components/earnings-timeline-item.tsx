'use client';
import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, HRIS_ROUTES, parseDate } from '@/shared';
import { Button } from './button';
import { Chip } from './chip';

type TimelineItem = {
  value: number;
  date: Date;
  id: string;
  employeeId: string;
  description?: string;
};

type Props = {
  isEditable: boolean;
  data: TimelineItem;
  index: number;
  first: boolean;
  last: boolean;
  tagLabel?: string | ReactNode;
  dateFormat: string;
};

export function EarningsTimelineItem({ isEditable, tagLabel, index, data, first, last, dateFormat }: Props) {
  const t = useTranslations();
  const router = useRouter();

  const { value, date, description, id, employeeId } = data;

  const dotClassNames = cn(
    'absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full',
    {
      'bg-accent': first,
      'bg-gray-300': !first,
    },
  );

  return (
    <div className="group mb-4 flex flex-row group-hover:opacity-100">
      <div className="mr-3 text-grey ">
        <div className="relative mt-1 size-5 rounded-full border border-gray-300">
          <span className={dotClassNames} />
        </div>
        {!last && <div className="m-auto min-h-full w-px bg-grey" />}
      </div>
      <div className="w-full">
        <div className="flex w-auto justify-between text-xs tracking-wider">
          <div className="flex flex-row flex-wrap items-baseline gap-2">
            <div className="text-lg font-semibold">{value}</div>
            <div className="text-xs font-semibold text-dark-grey">{t('earnings.netIncome')}</div>
            <div className="font-semibold sm:pl-4">{parseDate(date, dateFormat)}</div>
            {index === 0 && tagLabel && <Chip intent="info">{tagLabel}</Chip>}
          </div>
          {isEditable && (
            <div className="flex gap-2">
              <Button
                icon="edit-2"
                intent="tertiary"
                size="sm"
                onClick={() => router.push(HRIS_ROUTES.employees.earnings.edit(employeeId, data.id))}
              />
              <Button
                icon="trash"
                intent="tertiary"
                size="sm"
                onClick={() => router.push(HRIS_ROUTES.employees.earnings.delete(employeeId, id))}
              />
            </div>
          )}
        </div>
        <div className="mt-2 pr-6 text-xs font-normal text-dark-grey">{description}</div>
      </div>
    </div>
  );
}
