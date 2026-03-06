import dayjs from 'dayjs';
import { ApiError, type CUID } from '@/shared';
import { getBusinessDaysDiff } from '@/shared/utils/get-business-days-diff';
import { logger } from '@/shared/service/pino';
import { type RequestAbsenceDTO } from '../dtos/absence.dto';
import { type AbsenceRepository } from '../repositories/absence.repository';
import { type EmployeesAcl } from '../acl/employee.acl';

export function requestAbsenceUseCase(repository: AbsenceRepository, employeesAcl: EmployeesAcl) {
  return async (absence: RequestAbsenceDTO) => {
    const { startDate, endDate, issuerId } = absence;
    let recipientIds: CUID[] = [];
    const start = dayjs(startDate.toString());
    const end = dayjs(endDate.toString());

    const days = getBusinessDaysDiff(start, end);

    try {
      const employee = await employeesAcl.getEmployeeById(issuerId);
      if (!employee || !employee.firstName || !employee.lastName) {
        throw new ApiError(400, 'Invalid or missing employee data');
      }

      if (absence.type === 'GLOBAL') {
        recipientIds = await employeesAcl.getAllEmployeesIds();
      } else {
        recipientIds = [issuerId];
      }

      const label = `${employee.firstName} ${employee.lastName}`;

      const id = await repository.requestAbsence({ ...absence, label }, days, recipientIds);

      return id;
    } catch (err) {
      logger.info(err);
      throw new ApiError(500, 'Failed to request absence');
    }
  };
}
