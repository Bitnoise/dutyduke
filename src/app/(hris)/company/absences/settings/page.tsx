import { getTranslations } from '@/shared/service/locale/get-translations';
import { NoResults, Section } from '@/lib/ui';
import { parseDate } from '@/shared';
import { hrisApi } from '@/api/hris';
import { Pagination } from '@/lib/ui/components/pagination';
import { AbsencesCard } from '../_components/absences-card';
import { DaysOffTable } from './_components/days-off-table';
import { DaysOffBulkActions } from './_components/days-off-bulk-action';
import { DaysOffGridList } from './_components/days-off-grid-list';

type Props = {
  searchParams: Promise<{
    page?: string;
    perPage?: string;
  }>;
};

export default async function DayOffSettingsPage({ searchParams }: Props) {
  const t = await getTranslations('absences.settings');
  const { page: rawPage, perPage: rawPerPage } = await searchParams;

  const page = +(rawPage ?? '1');
  const perPage = rawPerPage ? +rawPerPage : undefined;

  const api = hrisApi;

  const [absences, me] = await Promise.all([
    api.absences.getAllAbsences(page, undefined, undefined, ['APPROVED'], ['GLOBAL'], undefined, perPage),
    api.auth.getMe(),
  ]);

  const parsedAbsences = {
    ...absences,
    items: absences.items.map(({ startDate, endDate, days, ...absence }) => ({
      ...absence,
      dateRange: `${parseDate(startDate, me.dateFormat)} - ${parseDate(endDate, me.dateFormat)} (${days}d)`,
    })),
  };

  return (
    <AbsencesCard>
      <Section heading={t('header')} />
      <DaysOffBulkActions actions={absences._access.actions} className="mb-6 hidden lg:block" />
      <DaysOffTable absences={parsedAbsences} className="hidden lg:table" />
      <DaysOffGridList absences={parsedAbsences} className="lg:hidden" />
      {absences.totalItems === 0 && <NoResults />}
      <Pagination
        nextPage={absences.nextPage}
        prevPage={absences.prevPage}
        totalPages={absences.totalPages}
      />
    </AbsencesCard>
  );
}
