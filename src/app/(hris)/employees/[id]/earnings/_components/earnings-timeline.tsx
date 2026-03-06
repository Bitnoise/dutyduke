'use client';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EmployeeEarningsDto } from '@/api/hris/employees/model/dtos';
import { EarningsTimelineItem, NoResults, Section } from '@/lib/ui';
import { type CUID, HRIS_ROUTES } from '@/shared';

type Props = {
  employeeId: CUID;
  earnings: EmployeeEarningsDto[];
  isEditable: boolean;
  dateFormat: string;
};

export function EaringsTimeline({ isEditable, employeeId, earnings, dateFormat }: Props) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Section
      className="flex flex-col gap-1 pb-16"
      editLabel={t('employees.earningsView.update')}
      heading={t('employees.earningsView.earnings')}
      isEdit={isEditable}
      onEdit={() => router.push(HRIS_ROUTES.employees.earnings.update(employeeId))}
    >
      {earnings.length ? (
        earnings.map(({ id, date, value, employeeId, description }, index) => (
          <EarningsTimelineItem
            key={id}
            data={{ value, employeeId, id, date, description }}
            dateFormat={dateFormat}
            first={index === 0}
            index={index}
            isEditable={isEditable}
            last={earnings.length - 1 === index}
            tagLabel={t('tags.current')?.toString().toLowerCase()}
          />
        ))
      ) : (
        <NoResults />
      )}
    </Section>
  );
}
