'use client';

import Link from 'next/link';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Icon } from '@/lib/ui';
import { type CUID, HRIS_ROUTES } from '@/shared';
import { type Absence } from '@/api/hris/prisma/client';
import { useQueryParams } from '@/lib/ui/hooks';
import { AbsenceCalendar } from './absence-calendar';

const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);

type Props = {
  employeeId: CUID;
  absences: Absence[];
  year: number;
};

export function CalendarsGrid({ employeeId, absences, year }: Props) {
  const { setSearchParams } = useQueryParams();
  const t = useTranslations('absences');

  const addYear = () => {
    setSearchParams('year', (year + 1).toString());
  };

  const subtractYear = () => {
    setSearchParams('year', (year - 1).toString());
  };

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex justify-between">
        <Link href={HRIS_ROUTES.employees.absence.request(employeeId)}>
          <Button icon="sun-fog">{t('requestLeave')}</Button>
        </Link>
        <nav className="flex items-center gap-x-2">
          <button aria-label="Previous year" onClick={subtractYear}>
            <Icon name="arrow-left" size="xs" />
          </button>
          <div className="h-5 w-px bg-black" />
          <span className="min-w-[69px] text-center text-sm font-semibold">{year}</span>
          <div className="h-5 w-px bg-black" />
          <button aria-label="Next year" onClick={addYear}>
            <Icon name="arrow-right" size="xs" />
          </button>
        </nav>
      </div>
      <div className="mx-auto flex flex-wrap gap-6">
        {monthsArray.map((month) => (
          <AbsenceCalendar key={`${month}-${year}`} month={month} ranges={absences} year={year} />
        ))}
      </div>
    </div>
  );
}
