import { type Equipment } from '@/api/hris/prisma/client';

export const serializeEquipment = <T extends Equipment>(equipment: T | null) => {
  if (!equipment) return null;

  return {
    ...equipment,
    value: equipment?.value ? Number(equipment.value) : null,
  };
};
