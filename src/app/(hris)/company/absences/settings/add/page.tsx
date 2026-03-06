import dayjs from 'dayjs';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { Card } from '@/lib/ui';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { hrisApi } from '@/api/hris';
import { CreateDayOffForm } from './_form/create-day-off.form';

export default async function CreateDayOffPage() {
  const t = await getTranslations('absences.settings.create');
  const api = hrisApi;

  const [absences, me] = await Promise.all([
    api.absences.getAllAbsences(
      1,
      dayjs().add(-1, 'years').toDate(),
      dayjs().add(2, 'years').toDate(),
      ['APPROVED'],
      ['GLOBAL'],
      undefined,
      'all',
    ),
    api.auth.getMe(),
  ]);

  const absencesSingleDates = new Set<string>();
  absences.items.forEach((absence) => {
    for (let date = dayjs(absence.startDate); date <= dayjs(absence.endDate); date = date.add(1, 'days')) {
      absencesSingleDates.add(date.format('YYYY-MM-DD'));
    }
  });
  const unavailableDates = [...absencesSingleDates].sort();

  return (
    <Card>
      <BasicHeader className="pb-8">{t('header')}</BasicHeader>
      <h2 className="pb-6">{t('subheader')}</h2>
      <CreateDayOffForm dateFormat={me.dateFormat} unavailableDates={unavailableDates} />
    </Card>
  );
}
