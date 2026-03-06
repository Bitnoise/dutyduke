import { type NextRequest } from 'next/server';
import icalendar from 'ical-generator';
import { getTranslations } from 'next-intl/server';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES, encodeFilenameForHeader } from '@/shared';
import { logger } from '@/shared/service/pino';

export async function GET(request: NextRequest, { params }: { params: { companyId: string } }) {
  const api = hrisApi;
  const t = await getTranslations();

  const [companyId, absences, me] = await Promise.all([
    api.company.getCompanyId(),
    api.absences.getAllAbsencesForCalendar(),
    api.auth.getMe(),
  ]);

  if (companyId !== params.companyId) {
    return Response.json({ error: 'invalid token' }, { status: 401 });
  }

  const filename = `${companyId}.ics`;

  try {
    const events = absences.map((absence) => ({
      start: absence.startDate,
      end: absence.endDate,
      summary: `${t('absences.type' + absence.type.toLowerCase())} - ${absence.label}`,
      description: t('absences.status' + absence.status.toLowerCase()),
      url: `${request.nextUrl.origin}${HRIS_ROUTES.company.absences.base}`,
    }));

    const calendar = icalendar({
      prodId: `//dutyduke//ical-generator//${me.locale.toUpperCase()}`,
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
