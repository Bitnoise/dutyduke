import { Suspense } from 'react';
import { type CUID } from '@/shared';
import { EquipmentSkeleton } from '@/app/(hris)/company/equipment/[equipmentId]/(equipment-tabs)/_components';
import { EquipmentGeneralContent } from './content';

type Props = {
  params: Promise<{
    equipmentId: CUID;
  }>;
};

export default async function EquipmentGeneralPage(props: Props) {
  const { equipmentId } = await props.params;
  return (
    <Suspense fallback={<EquipmentSkeleton sections={['basicInfo', 'purchase']} />}>
      <EquipmentGeneralContent equipmentId={equipmentId} />
    </Suspense>
  );
}
