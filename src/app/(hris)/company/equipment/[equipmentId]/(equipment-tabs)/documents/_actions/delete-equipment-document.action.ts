'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { type CUID, HRIS_ROUTES } from '@/shared';
import { deleteEquipmentDocumentSchema } from '../_schemas';

export async function deleteEquipmentDocument(equipmentId: CUID, documentId: CUID) {
  const api = hrisApi;

  await api.resources.deleteEquipmentDocument(equipmentId, documentId);

  revalidatePath(HRIS_ROUTES.equipment.documents.base(equipmentId));
}

export async function deleteEquipmentDocuments(equipmentId: CUID, formData: FormData) {
  const args = {
    selectedDocuments: formData.get('selectedDocuments') as string,
  };

  const validationResult = deleteEquipmentDocumentSchema.safeParse(args);

  if (!validationResult.success) {
    return;
  }

  const api = hrisApi;
  const { selectedDocuments } = validationResult.data;

  if (selectedDocuments === 'all') {
    const equipment = await api.resources.getEquipmentById(equipmentId);

    await api.resources.deleteEquipmentDocuments(equipmentId, equipment?.documentIds || []);
  } else {
    const documentIdsToDelete = args.selectedDocuments.split(',').filter(Boolean);

    await api.resources.deleteEquipmentDocuments(equipmentId, documentIdsToDelete);
  }

  revalidatePath(HRIS_ROUTES.employees.documents.base(equipmentId));
}
