import { type CUID } from '@/shared';

export type EmployeesPhotosRepository = {
  deleteAllEmployeePhotos: (employeeId: CUID) => Promise<void>;
  createEmployeePhoto: (employeeId: CUID, photoId: CUID) => Promise<void>;
  updateEmployeePhotos: (employeeId: CUID, photoIds: CUID[]) => Promise<void>;
  setEmployeeAvatar: (employeeId: CUID, photoId: CUID) => Promise<void>;
  unsetEmployeeAvatar: (employeeId: CUID) => Promise<void>;
};
