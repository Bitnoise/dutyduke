import { type UploadEquipmentDocumentSchema } from '@/app/(hris)/company/equipment/[equipmentId]/(equipment-tabs)/documents/_schemas/upload-equipment-document.schema';
import type { UploadEmployeeDocumentSchema } from '@/app/(hris)/employees/[id]/documents/_schemas';
import type { ActionReturnType, ActionReturnValidationErrorsType } from '@/shared';

export type UploadEmployeeDocumentState = ActionReturnType<
  UploadEmployeeDocumentSchema & { employeeId: string },
  undefined,
  ActionReturnValidationErrorsType<UploadEmployeeDocumentSchema>
>;

export type UploadEquipmentDocumentState = ActionReturnType<
  UploadEquipmentDocumentSchema & { equipmentId: string },
  undefined,
  ActionReturnValidationErrorsType<UploadEquipmentDocumentSchema>
>;
