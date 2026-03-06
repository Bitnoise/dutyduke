import { type SchedulerData } from '@bitnoi.se/react-scheduler';
import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';
import { type AbsenceDTO } from '@/api/hris/absences/model/dtos/absence.dto';
import { type BaseEmployeeDto } from '@/api/hris/employees/model/dtos';
import { API_ROUTES } from '../constants';
import { parseDate } from './parse-date';

type ParseAbsencesDataProps = Array<BaseEmployeeDto & { absences: AbsenceDTO[] }>;

const ABSENCE_COLOR_MAP = {
  HOLIDAY: '#5fbf9d',
  SICK: '#d9ac6a',
  PERSONAL: '#51a2ff',
  GLOBAL: '#65798b',
} as const;

export async function parseAbsencesData(
  employees: ParseAbsencesDataProps,
  locale: string,
): Promise<SchedulerData> {
  const t = await getTranslations();

  return employees.map((employee) => ({
    id: employee.id,
    label: {
      icon: employee.avatarId ? API_ROUTES.photos(employee.avatarId) : '',
      title: `${employee.firstName} ${employee.lastName}`,
      subtitle: employee.role ?? '-',
    },
    data: employee.absences.map(({ id, startDate, endDate, status, days, type }) => ({
      id,
      description: `${parseDate(startDate, locale)} - ${parseDate(endDate, locale)}`,
      startDate,
      endDate,
      occupancy: dayjs(endDate).diff(startDate, 'second'),
      title:
        status === 'APPROVED'
          ? `${days ?? 0} ${t('general.days')} | ${t('absences.type.' + type.toLowerCase())}`
          : 'Request',
      subtitle: `${days ?? 0} ${t('general.days')} `,
      bgColor: ABSENCE_COLOR_MAP[type as keyof typeof ABSENCE_COLOR_MAP],
    })),
  }));
}
