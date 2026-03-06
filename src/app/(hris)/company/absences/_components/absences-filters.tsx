import { useTranslations } from '@/shared/service/locale/use-translations';
import { FilterTag } from '@/lib/ui/components/filter-tag';
import { cn, type PropsWithClassName } from '@/shared';

export function AbsencesFiltersStatus({ className }: PropsWithClassName) {
  const t = useTranslations('absences');

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <h6 className="text-xs font-semibold">{t('filters.status')}</h6>
      <FilterTag className="shrink-0" searchParamKey="STATUS" value="PENDING" variant="orange">
        {t('status.pending')}
      </FilterTag>
      <FilterTag className="shrink-0" searchParamKey="STATUS" value="APPROVED" variant="green">
        {t('status.approved')}
      </FilterTag>
      <FilterTag className="shrink-0" searchParamKey="STATUS" value="REJECTED" variant="darkRed">
        {t('status.rejected')}
      </FilterTag>
    </div>
  );
}

export function AbsencesFiltersType({ className }: PropsWithClassName) {
  const t = useTranslations('absences');

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <h6 className="text-xs font-semibold">{t('filters.type')}</h6>
      <FilterTag className="shrink-0" searchParamKey="TYPE" value="HOLIDAY" variant="green">
        {t('type.holiday')}
      </FilterTag>
      <FilterTag className="shrink-0" searchParamKey="TYPE" value="SICK" variant="orange">
        {t('type.sick')}
      </FilterTag>
      <FilterTag className="shrink-0" searchParamKey="TYPE" value="PERSONAL" variant="blue">
        {t('type.personal')}
      </FilterTag>
    </div>
  );
}
