import icalendar from 'ical-generator';
import { getTranslations } from 'next-intl/server';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES, encodeFilenameForHeader } from '@/shared';
import { logger } from '@/shared/service/pino';

export async function GET(_request: Request, { params }: { params: Promise<{ companyId: string }> }) {
  const api = hrisApi;
  const t = await getTranslations();
  const { companyId: requestedCompanyId } = await params;

  const [companyId, absences] = await Promise.all([
    api.company.getCompanyId(),
    api.absences.getAllAbsencesForCalendar(),
  ]);

  if (companyId !== requestedCompanyId) {
    return Response.json({ error: 'invalid token' }, { status: 401 });
  }

  const filename = `${companyId}.ics`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  try {
    const events = absences.map((absence) => {
      const typeName = t(`absences.type.${absence.type.toLowerCase()}`);
      const summary = absence.label ? `${typeName} - ${absence.label}` : typeName;

      // iCal all-day events use exclusive end date (day after last day)
      const endDate = new Date(absence.endDate);
      endDate.setDate(endDate.getDate() + 1);

      return {
        start: absence.startDate,
        end: endDate,
        allDay: true,
        summary,
        description: t(`absences.status.${absence.status.toLowerCase()}`),
        url: `${appUrl}${HRIS_ROUTES.company.absences.base}`,
      };
    });

    const calendar = icalendar({
      prodId: '//dutyduke//ical-generator//EN',
      events,
    });

    return new Response(calendar.toString(), {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; ${encodeFilenameForHeader(filename)}`,
      },
      status: 200,
    });
  } catch (err) {
    logger.error(err);
    return Response.json(JSON.stringify(err), { status: 500 });
  }
}
