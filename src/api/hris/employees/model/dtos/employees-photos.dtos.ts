import { type CUID } from '@/shared';

export type UpdateEmployeePhotoDto = { file: File } | { id: string };

export type EmployeePhotoDto = {
  id: CUID;
  filePath: string;
};

export type CreateEmployeePhotoDto = {
  filePath: string;
};
