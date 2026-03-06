'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { ComboBox } from '@/lib/ui/components/combo-box/combo-box';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { FilterTag } from '@/lib/ui/components/filter-tag';
import { useQueryParams } from '@/lib/ui/hooks';
import { cn, type PropsWithClassName, SEARCH_PARAM_KEYS } from '@/shared';

type Props = {
  categories: Item[];
  assignedFiltersEnabled: boolean;
};

export function DocumentsFilters({
  categories,
  className,
  assignedFiltersEnabled,
}: PropsWithClassName<Props>): JSX.Element {
  const t = useTranslations('company.documents');
  const { searchParams, setSearchParams } = useQueryParams();

  const selectedCategory = searchParams.get(SEARCH_PARAM_KEYS.CATEGORY);

  return (
    <div className={cn('flex-col xl:flex-row flex gap-x-8 gap-y-4 py-1.5', className)}>
      <section className="flex flex-col gap-x-4 gap-y-1.5 xl:flex-row xl:items-center">
        <span className="text-xs font-semibold">{t('filters.category')}:</span>
        <ComboBox
          aria-label="category filters"
          className="xl:w-[9.375rem] xl:basis-[9.375rem]"
          defaultSelectedKey={categories.find((category) => category.key === selectedCategory)?.key}
          items={categories}
          onSelectionChange={(key) =>
            setSearchParams(SEARCH_PARAM_KEYS.CATEGORY, key ? key.toString() : 'ALL')
          }
        />
      </section>
      {assignedFiltersEnabled && (
        <section className="flex flex-col gap-x-4 gap-y-1.5 xl:flex-row xl:items-center">
          <span className="text-xs font-semibold">{t('filters.filters')}:</span>
          <FilterTag searchParamKey={'FILTER'} value="ASSIGNED" variant="lightGreen">
            <span className="text-green-300">{t('filters.assigned')}</span>
          </FilterTag>
          <FilterTag searchParamKey={'FILTER'} value="FREE" variant="blue">
            {t('filters.free')}
          </FilterTag>
        </section>
      )}
      <section className="flex flex-col gap-x-4 gap-y-2.5 xl:flex-row xl:items-center">
        <span className="text-xs font-semibold">{t('filters.status')}:</span>
        <FilterTag className="shrink-0" searchParamKey="STATUS" value="ACTIVE" variant="green">
          {t('filters.active')}
        </FilterTag>
        <FilterTag className="shrink-0" searchParamKey="STATUS" value="EXPIRING_SOON" variant="orange">
          {t('filters.expiringSoon')}
        </FilterTag>
        <FilterTag className="shrink-0" searchParamKey="STATUS" value="EXPIRED" variant="darkRed">
          {t('filters.expired')}
        </FilterTag>
        <FilterTag className="shrink-0" searchParamKey="STATUS" value="ARCHIVED" variant="gray">
          {t('filters.archived')}
        </FilterTag>
      </section>
    </div>
  );
}
