import { getLocale, getTranslations } from 'next-intl/server';
import { type Metadata } from 'next';
import { type BenefitOrderBy } from '@/shared';
import { SearchInput, NoResults } from '@/lib/ui';
import {
  BenefitsBulkActions,
  BenefitsGridList,
  BenefitsTable,
} from '@/app/(hris)/company/benefits/_components';
import { hrisApi } from '@/api/hris';
import { Pagination } from '@/lib/ui/components/pagination';
import { Stack } from '@/lib/ui/components/stack';
import { BenefitsOptions } from '@/app/(hris)/company/benefits/_components/benefits-options';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'company.benefits' });

  return {
    title: t('title'),
  };
}

type Props = {
  searchParams: Promise<{
    page?: string;
    sort?: BenefitOrderBy;
    search?: string;
    perPage?: string;
  }>;
};

export default async function BenefitsPage({ searchParams }: Props) {
  const { sort, page, search, perPage } = await searchParams;

  const t = await getTranslations('company.benefits');
  const api = hrisApi;

  const parsedPage = page ? +page : 1;
  const parsedPerPage = perPage ? +perPage : undefined;

  const [benefits, me] = await Promise.all([
    api.benefits.getBenefitList(parsedPage, sort ?? 'createdAt-desc', search, parsedPerPage),
    api.auth.getMe(),
  ]);

  return (
    <>
      <BenefitsOptions />
      <Stack className="pb-4" direction="column">
        <Stack>
          <SearchInput
            aria-label={t('searchBenefits')}
            className="basis-full xl:basis-2/5"
            inputProps={{ placeholder: t('search') }}
          />
          <BenefitsBulkActions actions={benefits._access.actions} benefits={benefits.items} />
        </Stack>
      </Stack>
      <BenefitsTable
        navigationEnabled
        benefits={benefits}
        className="hidden xl:table"
        dateFormat={me.dateFormat}
      />
      <BenefitsGridList
        navigationEnabled
        benefits={benefits}
        className="xl:hidden"
        dateFormat={me.dateFormat}
      />
      {benefits.totalItems === 0 && <NoResults />}
      <Pagination
        nextPage={benefits.nextPage}
        prevPage={benefits.prevPage}
        totalPages={benefits.totalPages}
      />
    </>
  );
}
