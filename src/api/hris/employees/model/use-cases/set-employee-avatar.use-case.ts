import { type EmployeesPhotosRepository } from '@/api/hris/employees/model/repositories';
import { type CUID } from '@/shared';

export function setEmployeeAvatarUseCase(repository: EmployeesPhotosRepository) {
  return async (employeeId: CUID, photoId: CUID, currentAvatarId: CUID | null) => {
    if (currentAvatarId === photoId) await repository.unsetEmployeeAvatar(employeeId);
    else await repository.setEmployeeAvatar(employeeId, photoId);
  };
}
