import { getLocale, getTranslations } from 'next-intl/server';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { hrisApi } from '@/api/hris';
import { TabList, BottomTabNav } from '@/lib/ui/components/tab-nav';
import {
  getDictionarySubsections,
  getDictionaryEntitiesProvider,
  type DictionaryName,
  type DictionaryArea,
} from '@/shared/service/dictionaries/dictionaries.service';
import { SearchInput } from '@/lib/ui';
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
  const t = await getTranslations({ locale, namespace: 'company.equipment' });
  const api = hrisApi;

  const parsedPage = page ? +page : 1;
  const parsedPerPage = perPage ? +perPage : ITEMS_PER_PAGE;

  const tabs = getDictionarySubsections('resources', HRIS_ROUTES.company.equipment.dictionaries);
  const data = await getDictionaryEntitiesProvider(
    api,
    'resources',
    name as DictionaryName<DictionaryArea>,
    parsedPerPage,
    parsedPage,
    search,
  );

  return (
    <>
      <BasicHeader>{t('dictionaries.base')}</BasicHeader>
      <section className="flex gap-x-4 pb-2 pt-6">
        <SearchInput
          aria-label={t('searchEquipment')}
          className="basis-full xl:basis-2/5"
          inputProps={{ placeholder: t('search') }}
        />
        <DictionaryBulkActionsContent name={name} />
      </section>
      <nav className="relative z-40">
        <BottomTabNav className="md:hidden" tabs={tabs} />
        <TabList className="hidden md:flex" tabs={tabs} />
      </nav>
      <DictionaryContent dictionaryName={name} entities={data.items} totalItems={data.totalItems} />
      <Pagination nextPage={data.nextPage} prevPage={data.prevPage} totalPages={data.totalPages} />
    </>
  );
}
