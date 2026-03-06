import { getLocale, getTranslations } from 'next-intl/server';
import { hrisApi } from '@/api/hris';
import { Section } from '@/lib/ui/components/section';
import { AbsencesCard } from '../_components/absences-card';
import { IcalUrl } from '../ical/_components/IcalUrl';

// Check if we're in a build environment (no database available)
function isBuildTime(): boolean {
  return process.env.npm_lifecycle_event === 'build' || process.env.NEXT_PHASE === 'phase-production-build';
}

export default async function IcalPage(): Promise<JSX.Element> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'absences.ical' });

  // During build, skip database queries
  if (isBuildTime()) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const icalUrl = `${appUrl}/api/calendar/absences/`;
    return (
      <AbsencesCard>
        <Section heading={t('icalFeed')} />
        <IcalUrl translationBaseKey="absences.ical" url={icalUrl} />
      </AbsencesCard>
    );
  }

  const api = hrisApi;
  const companyId = await api.company.getCompanyId();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  // Single organization - no subdomain in URL
  const icalUrl = `${appUrl}/api/calendar/absences/${companyId}`;

  return (
    <AbsencesCard>
      <Section heading={t('icalFeed')} />
      <IcalUrl translationBaseKey="absences.ical" url={icalUrl} />
    </AbsencesCard>
  );
}
