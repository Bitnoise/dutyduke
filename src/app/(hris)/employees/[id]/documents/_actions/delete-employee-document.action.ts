'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { type CUID, HRIS_ROUTES } from '@/shared';
import { deleteEmployeeDocumentSchema } from '@/app/(hris)/employees/[id]/documents/_schemas';

export async function deleteEmployeeDocument(employeeId: CUID, documentId: CUID) {
  const api = hrisApi;
  await api.employees.deleteEmployeeDocument(employeeId, documentId);

  revalidatePath(HRIS_ROUTES.employees.documents.base(employeeId));
}

export async function deleteEmployeeDocuments(employeeId: CUID, formData: FormData) {
  const args = {
    selectedDocuments: formData.get('selectedDocuments') as string,
  };

  const validationResult = deleteEmployeeDocumentSchema.safeParse(args);

  if (!validationResult.success) {
    return;
  }

  const api = hrisApi;
  const { selectedDocuments } = validationResult.data;

  if (selectedDocuments === 'all') {
    const { documentIds } = await api.employees.getEmployeeById(employeeId);
    await api.employees.deleteAllEmployeeDocuments(employeeId, documentIds);
  } else {
    const documentIdsToDelete = args.selectedDocuments.split(',').filter(Boolean);

    api.employees.deleteEmployeeDocuments(employeeId, documentIdsToDelete);
  }

  revalidatePath(HRIS_ROUTES.employees.documents.base(employeeId));
}
