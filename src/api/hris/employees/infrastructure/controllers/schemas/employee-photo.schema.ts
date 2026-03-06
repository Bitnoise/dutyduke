import { type CUID } from '@/shared';

export type EmployeePhotoSchema = {
  id: CUID;
  filePath: string;
  isAvatar: boolean;
};

export type UpdateEmployeePhotoSchema =
  | {
      file: File;
    }
  | { id: string };
