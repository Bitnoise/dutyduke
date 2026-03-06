'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { ComboBox } from '@/lib/ui/components/combo-box/combo-box';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { FilterTag } from '@/lib/ui/components/filter-tag';
import { useQueryParams } from '@/lib/ui/hooks';
import { cn, type PropsWithClassName, SEARCH_PARAM_KEYS } from '@/shared';
import { Stack } from '@/lib/ui/components/stack';

type Props = {
  categories: Item[];
  assignedFiltersEnabled?: boolean;
};

export function EmployeeEquipmentFilters({
  categories,
  className,
  assignedFiltersEnabled,
}: PropsWithClassName<Props>): JSX.Element {
  const t = useTranslations('company.equipment');
  const tNext = useNextTranslations('company.equipment');
  const { searchParams, setSearchParams } = useQueryParams();

  const selectedCategory = searchParams.get(SEARCH_PARAM_KEYS.CATEGORY);

  return (
    <>
      <Stack className={cn('items-center py-1.5', className)}>
        <span className="text-xs font-semibold">{t('filters.category')}</span>
        <ComboBox
          aria-label={tNext('filters.category')}
          className="xl:w-[9.375rem] xl:basis-[9.375rem]"
          defaultSelectedKey={categories.find((category) => category.key === selectedCategory)?.key}
          items={categories}
          onSelectionChange={(key) => setSearchParams(SEARCH_PARAM_KEYS.CATEGORY, key!.toString())}
        />
        <Stack className="items-center">
          <span className="text-xs font-semibold">{t('filters.status')}</span>
          <FilterTag className="shrink-0" searchParamKey="STATUS" value="WORKING" variant="green">
            {t('statusLabels.working')}
          </FilterTag>
          <FilterTag className="shrink-0" searchParamKey="STATUS" value="IN_SERVICE" variant="orange">
            {t('statusLabels.in_service')}
          </FilterTag>
          <FilterTag className="shrink-0" searchParamKey="STATUS" value="BROKEN" variant="gray">
            {t('statusLabels.broken')}
          </FilterTag>
          <FilterTag className="shrink-0" searchParamKey="STATUS" value="ARCHIVED" variant="gray">
            {t('statusLabels.archived')}
          </FilterTag>
        </Stack>
      </Stack>
      {assignedFiltersEnabled && (
        <section className={cn('flex flex-col gap-x-4 gap-y-1.5 xl:flex-row xl:items-center', className)}>
          <span className="text-xs font-semibold">{t('filters.filters')}</span>
          <FilterTag searchParamKey={'FILTER'} value="ASSIGNED" variant="orange">
            {t('filters.assigned')}
          </FilterTag>
          <FilterTag searchParamKey={'FILTER'} value="FREE" variant="blue">
            {t('filters.free')}
          </FilterTag>
        </section>
      )}
    </>
  );
}
