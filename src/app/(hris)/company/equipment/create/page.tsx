import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { type Metadata } from 'next';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { hrisApi } from '@/api/hris';
import { getPermissionChecker } from '@/api/hris/authorization';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { HRIS_ROUTES } from '@/shared';
import { CreateEquipmentForm } from './_forms/create-equipment-form';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'company.equipment.create' });

  return {
    title: t('title'),
  };
}

export default async function CreateEquipmentPage() {
  const permissionChecker = await getPermissionChecker();

  // Check if user has CREATE permission for COMPANY_EQUIPMENT
  const canCreateEquipment = permissionChecker.can(ResourceType.COMPANY_EQUIPMENT, PermissionAction.CREATE);

  if (!canCreateEquipment) {
    return redirect(HRIS_ROUTES.dashboard);
  }

  const t = await getTranslations('company.equipment.create');
  const api = hrisApi;

  const [categories, locations, me] = await Promise.all([
    api.resources.getAllCategories(),
    api.resources.getAllEquipmentLocations(),
    api.auth.getMe(),
  ]);

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
        locations={parsedLocations}
      />
    </>
  );
}
