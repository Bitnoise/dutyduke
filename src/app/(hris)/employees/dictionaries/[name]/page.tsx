import { getLocale, getTranslations as getNextTranslations } from 'next-intl/server';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { hrisApi } from '@/api/hris';
import { TabList, BottomTabNav } from '@/lib/ui/components/tab-nav';
import {
  getDictionarySubsections,
  getDictionaryEntitiesProvider,
  type DictionaryArea,
  type DictionaryName,
} from '@/shared/service/dictionaries/dictionaries.service';
import { Card, SearchInput } from '@/lib/ui';
import { Pagination } from '@/lib/ui/components/pagination';
import { HRIS_ROUTES } from '@/shared/constants/routes';
import { ITEMS_PER_PAGE } from '@/shared';
import { DictionaryContent } from './components/dictionary-content';
import { DictionaryBulkActionsContent } from './components/dictionary-bulk-actions-content';

type Props = {
  params: Promise<{ name: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    perPage?: string;
  }>;
};

export default async function DictionariesPage({ params, searchParams }: Props) {
  const { name } = await params;
  const { page, search, perPage } = await searchParams;
  const locale = await getLocale();
  const tNext = await getNextTranslations({ locale, namespace: 'employees.dictionaries' });
  const t = await getTranslations('employees.dictionaries');
  const api = hrisApi;

  const parsedPage = page ? +page : 1;
  const parsedPerPage = perPage ? +perPage : ITEMS_PER_PAGE;

  const tabs = getDictionarySubsections('employees', HRIS_ROUTES.employees.dictionaries);
  const data = await getDictionaryEntitiesProvider(
    api,
    'employees',
    name as DictionaryName<DictionaryArea>,
    parsedPerPage,
    parsedPage,
    search,
  );

  return (
    <>
      <Card>
        <BasicHeader>{t('title')}</BasicHeader>
        <section className="flex gap-x-4 pb-2 pt-6">
          <SearchInput
            aria-label={tNext('search')}
            className="basis-full xl:basis-2/5"
            inputProps={{ placeholder: tNext('search') }}
          />
          <DictionaryBulkActionsContent name={name} />
        </section>
        <nav className="relative z-40">
          <BottomTabNav className="md:hidden" tabs={tabs} />
          <TabList className="hidden md:flex" tabs={tabs} />
        </nav>
        <DictionaryContent dictionaryName={name} entities={data.items} totalItems={data.totalItems} />
        <Pagination nextPage={data.nextPage} prevPage={data.prevPage} totalPages={data.totalPages} />
      </Card>
    </>
  );
}
