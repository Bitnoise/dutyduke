import { ApiError, parseDate, type CUID } from '@/shared';
import { type EmailSenderService } from '@/api/hris/acl/email-service.acl';
import { logger } from '@/shared/service/pino';
import { type AbsenceRepository } from '../repositories/absence.repository';
import { type EmployeesAcl } from '../acl/employee.acl';

export function approveAbsenceUseCase(
  repository: AbsenceRepository,
  employeesAcl: EmployeesAcl,
  emailSenderService: EmailSenderService,
) {
  return async (absenceId: CUID[], reviewerId: CUID, locale: string) => {
    try {
      for (const id of absenceId) {
        const absence = await repository.getAbsenceById(id);
        if (!absence) {
          logger.warn(`Absence with id ${id} not found`);
          continue;
        }

        const employee = await employeesAcl.getEmployeeById(absence.issuerId);
        if (!employee) {
          throw new ApiError(404, `Employee with id ${absence.issuerId} not found`);
        }

        if (!employee.workEmail) {
          throw new ApiError(400, `Employee ${employee.firstName} ${employee.lastName} has no work email`);
        }

        // Approve the absence first (critical operation)
        await repository.approveAbsence(id, reviewerId);

        // Send email notification (non-critical - don't fail if email fails)
        try {
          await emailSenderService.sendEmail({
            to: employee.workEmail,
            html: {
              template: 'approveAbsenceTemplate',
              variables: {
                firstName: employee.firstName,
                startDate: parseDate(absence.startDate, locale),
                endDate: parseDate(absence.endDate, locale),
                days: absence.days,
              },
            },
          });
        } catch (emailError) {
          // Log email error but don't fail the operation
          logger.warn('Failed to send approval email', {
            absenceId: id,
            employeeId: employee.id,
            error: emailError,
          });
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      logger.error('Failed to approve absence', err);
      throw new ApiError(500, 'Failed to approve absence');
    }
  };
}
