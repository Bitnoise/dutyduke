import Link from 'next/link';
import { getTranslations as getNextTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Card, Icon, NoResults } from '@/lib/ui';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES, parseDate } from '@/shared';
import { type IconNames } from '@/lib/ui/icons';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { AbsencesGridList } from '../company/absences/_components/absences-grid-list';
import { DocumentsGridList } from '../company/documents/_components';
import { DEFAULT_CATEGORY_PRIORITY, DOCUMENTS_CATEGORIES_PRIORITY } from '../company/documents/_constants';

type WidgetHeaderProps = {
  icon: IconNames;
  heading: string | ReactNode;
  href: string;
};

function WidgetHeader({ icon, heading, href }: WidgetHeaderProps) {
  const t = useTranslations('dashboard');

  return (
    <div className="flex items-center gap-x-2">
      <Icon className="text-green-700" name={icon} />
      <h2 className="text-lg font-semibold">{heading}</h2>
      <Link className="ml-auto" href={href}>
        <Button
          className="hidden lg:block"
          icon="arrow-right"
          iconPlacement="right"
          intent="ghost"
          type="button"
        >
          {t('viewMore')} <span className="sr-only">{heading}</span>
        </Button>
        <Button
          aria-label={`${t('viewMore')} ${heading}`}
          className="lg:hidden"
          icon="arrow-right"
          intent="ghost"
          type="button"
        />
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
  const api = hrisApi;
  const t = await getTranslations();
  const tNext = await getNextTranslations();
  const me = await api.auth.getMe();
  const permissionChecker = await getPermissionChecker();

  // Check permissions for absences and documents
  const canViewAbsences = permissionChecker.can(ResourceType.COMPANY_ABSENCES, PermissionAction.VIEW);
  const canViewDocuments = permissionChecker.can(ResourceType.COMPANY_DOCUMENTS, PermissionAction.VIEW);

  const [absences, documents, documentsCategories] = await Promise.all([
    canViewAbsences
      ? api.absences.getAllAbsences(
          1,
          undefined,
          undefined,
          ['PENDING'],
          ['HOLIDAY', 'PERSONAL', 'SICK'],
          'requestedAt-desc',
          7,
          undefined,
        )
      : undefined,
    canViewDocuments
      ? api.documents.getDocumentsList(
          'companyDocument',
          1,
          'expDate-asc',
          ['ACTIVE', 'EXPIRING_SOON', 'EXPIRED'],
          ['ASSIGNED', 'FREE'],
          null,
          true,
          undefined,
          7,
        )
      : undefined,
    canViewDocuments ? api.documents.getAllCategories(undefined, 1, 'all') : undefined,
  ]);

  const parsedCategories = documentsCategories
    ? [
        { key: 'ALL', label: tNext('company.documents.filters.all') },
        ...documentsCategories.items
          .map(({ id, name }) => ({ key: id, label: name }))
          .sort(
            (a, b) =>
              (DOCUMENTS_CATEGORIES_PRIORITY[a.label] || DEFAULT_CATEGORY_PRIORITY) -
              (DOCUMENTS_CATEGORIES_PRIORITY[b.label] || DEFAULT_CATEGORY_PRIORITY),
          ),
      ]
    : [];

  const absencesWithEmployees = await Promise.all(
    absences?.items.map(async ({ issuerId, startDate, endDate, days, ...absence }) => ({
      ...absence,
      dateRange: `${parseDate(startDate, me.dateFormat)} - ${parseDate(endDate, me.dateFormat)} (${days}d)`,
      issuer: await api.employees.getEmployeeById(issuerId),
    })) ?? [],
  );

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="flex flex-row items-center justify-between px-4 py-5 shadow-[0_4px_15px_0_rgba(39,55,75,0.06)]">
        <h1 className="text-lg">
          <span className="font-semibold">{t('dashboard.welcome')} </span> {me.firstName} {me.lastName}
        </h1>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {canViewAbsences && absences && absencesWithEmployees && (
          <Card className="min-h-[428px] shadow-[0_4px_15px_0_rgba(39,55,75,0.06)]">
            <WidgetHeader
              heading={t('dashboard.absences')}
              href={HRIS_ROUTES.company.absences.base}
              icon="sun-fog"
            />
            {absences.items.length > 0 ? (
              <AbsencesGridList
                disableActions
                absences={{
                  ...absences,
                  items: absencesWithEmployees,
                }}
                dateFormat={me.dateFormat}
                reviewerId={me.id}
                selectionMode="none"
              />
            ) : (
              <NoResults />
            )}
          </Card>
        )}
        {canViewDocuments && documents && (
          <Card className="min-h-[428px] shadow-[0_4px_15px_0_rgba(39,55,75,0.06)]">
            <WidgetHeader
              heading={t('dashboard.documents')}
              href={HRIS_ROUTES.documents.base}
              icon="document-text"
            />
            {documents.items.length > 0 ? (
              <DocumentsGridList
                disableActions
                navigationEnabled
                categories={parsedCategories}
                dateFormat={me.dateFormat}
                documents={documents}
                selectionMode="none"
              />
            ) : (
              <NoResults />
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
