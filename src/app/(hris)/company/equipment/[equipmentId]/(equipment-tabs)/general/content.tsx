import { redirect } from 'next/navigation';
import { hrisApi } from '@/api/hris';
import {
  BasicInfoSegment,
  EquipmentPurchaseInfoSegment,
} from '@/app/(hris)/company/equipment/[equipmentId]/(equipment-tabs)/general/_forms';
import { HRIS_ROUTES, type CUID } from '@/shared';

type Props = {
  equipmentId: CUID;
};

export async function EquipmentGeneralContent({ equipmentId }: Props) {
  const api = hrisApi;

  const [equipment, categories, locations, me] = await Promise.all([
    api.resources.getEquipmentGeneralData(equipmentId),
    api.resources.getAllCategories(),
    api.resources.getAllEquipmentLocations(),
    api.auth.getMe(),
  ]);

  if (!equipment) {
    return redirect(HRIS_ROUTES.equipment.base);
  }

  const parsedCategories = categories.map((category) => ({
    key: category.id,
    label: category.name,
  }));

  const parsedLocations = locations.map((location) => ({
    key: location.id,
    label: location.name,
  }));

  const isEditable = equipment._access.actions.includes('edit') && equipment.status !== 'ARCHIVED';

  return (
    <div className="flex flex-col gap-y-8">
      <BasicInfoSegment
        categories={parsedCategories}
        equipment={{
          ...equipment,
          avatar: equipment.avatarId,
          category: equipment.category?.name ?? '',
          location: equipment.location?.name ?? '',
        }}
        isEditable={isEditable}
        locations={parsedLocations}
      />
      <EquipmentPurchaseInfoSegment
        dateFormat={me.dateFormat}
        equipment={equipment}
        isEditable={isEditable}
      />
    </div>
  );
}
