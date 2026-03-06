import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { type Metadata } from 'next';
import { hrisApi } from '@/api/hris';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { HRIS_ROUTES, type CUID } from '@/shared';
import { CreateEquipmentForm } from '@/app/(hris)/company/equipment/create/_forms/create-equipment-form';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'company.equipment.duplicate' });

  return {
    title: t('title'),
  };
}

type Props = {
  params: Promise<{
    equipmentId: CUID;
  }>;
};

export default async function EquipmentDuplicate(props: Props) {
  const { equipmentId } = await props.params;
  const permissionChecker = await getPermissionChecker();

  // Check if user has CREATE permission for COMPANY_EQUIPMENT (duplicate requires create)
  const canCreateEquipment = permissionChecker.can(ResourceType.COMPANY_EQUIPMENT, PermissionAction.CREATE);

  if (!canCreateEquipment) {
    return redirect(HRIS_ROUTES.dashboard);
  }

  const t = await getTranslations('company.equipment.duplicate');
  const api = hrisApi;

  const [equipment, categories, locations, me] = await Promise.all([
    api.resources.getEquipmentById(equipmentId),
    api.resources.getAllCategories(),
    api.resources.getAllEquipmentLocations(),
    api.auth.getMe(),
  ]);

  if (!equipment) {
    redirect(HRIS_ROUTES.equipment.base);
  }

  const parsedCategories = categories.map((category) => ({
    key: category.id,
    label: category.name,
  }));

  const parsedLocations = locations.map((location) => ({
    key: location.id,
    label: location.name,
  }));

  return (
    <>
      <BasicHeader>{t('title')}</BasicHeader>
      <CreateEquipmentForm
        categories={parsedCategories}
        dateFormat={me.dateFormat}
        equipment={equipment}
        locations={parsedLocations}
      />
    </>
  );
}
