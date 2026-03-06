import { redirect } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { type CUID, HRIS_ROUTES, parseString } from '@/shared';
import { hrisApi } from '@/api/hris';
import { Avatar, BottomTabNav, Button, Flag, TabList } from '@/lib/ui';
import { EquipmentItemMenu } from '@/app/(hris)/company/equipment/_components';
import { type Tab } from '@/lib/ui/components/tab-nav/types';

const EQUIPMENT_TABS: Array<Omit<Tab, 'href'> & { href: (employeeId: CUID) => string }> = [
  {
    id: '1',
    label: 'general',
    icon: 'monitor-mobile',
    href: HRIS_ROUTES.equipment.general,
  },
  {
    id: '2',
    label: 'documents',
    icon: 'document-text',
    href: HRIS_ROUTES.equipment.documents.base,
  },
];

type Props = {
  params: Promise<{
    equipmentId: CUID;
  }>;
};

export default async function EquipmentLayout(props: PropsWithChildren<Props>) {
  const { equipmentId } = await props.params;
  const { children } = props;
  const permissionChecker = await getPermissionChecker();

  // Check if user has VIEW permission for COMPANY_EQUIPMENT
  const canViewEquipment = permissionChecker.can(ResourceType.COMPANY_EQUIPMENT, PermissionAction.VIEW);

  if (!canViewEquipment) {
    return redirect(HRIS_ROUTES.equipment.base);
  }

  const api = hrisApi;

  const equipment = await api.resources.getEquipmentGeneralData(equipmentId);

  if (!equipment) {
    return redirect(HRIS_ROUTES.equipment.base);
  }

  const t = await getTranslations('company.equipment');

  const assignee = equipment.assigneeId ? await api.employees.getEmployeeById(equipment.assigneeId) : null;
  const assigneeFullName = assignee ? `${assignee.firstName} ${assignee.lastName}` : '-';

  const brandAndModel = [equipment.brand, equipment.model].filter(Boolean).join(' ');

  const tabs = EQUIPMENT_TABS.map((tab) => ({ ...tab, href: tab.href(equipmentId) }));

  return (
    <div>
      <header className="flex flex-col gap-x-2.5 gap-y-2 md:pb-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-x-2.5">
          <Button className="md:hidden" icon="arrow-left" intent="ghost" />
          <div>
            <h1 className="text-xl font-semibold md:text-xxl">{equipment.name}</h1>
            <h2 className="text-xs font-semibold text-accent">
              {parseString(
                brandAndModel.length ? `${brandAndModel} - ${equipment.signature}` : equipment.signature,
                '-',
              )}
            </h2>
          </div>
          <EquipmentItemMenu
            actions={equipment._access.actions}
            className="ml-auto md:hidden"
            equipmentId={equipmentId}
            isAssigned={!!equipment.assigneeId}
          />
        </div>
        <div className="flex items-center gap-x-4 lg:ml-auto">
          {assignee && (
            <div className="flex h-6 w-fit shrink-0 items-center gap-x-2 rounded-full border border-green-800 px-1 text-xxs">
              <Avatar avatarId={assignee?.avatarId} size="xs" />
              <span className="shrink-0">{assigneeFullName}</span>
            </div>
          )}
          <Flag intent="success">{t(`statusLabels.${equipment.status.toLowerCase()}`)}</Flag>
          <EquipmentItemMenu
            actions={equipment._access.actions}
            className="hidden md:block"
            equipmentId={equipmentId}
            isAssigned={!!equipment.assigneeId}
          />
        </div>
      </header>
      <nav className="relative z-40 pb-3.5 md:pb-8">
        <BottomTabNav className="md:hidden" tabs={tabs} />
        <TabList className="hidden md:flex" tabs={tabs} />
      </nav>
      {children}
    </div>
  );
}
