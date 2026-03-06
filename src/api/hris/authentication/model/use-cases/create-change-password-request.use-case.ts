import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';
import { type ChangePasswordRepository } from '@/api/hris/authentication/model/repository';
import { type ChangePasswordMessageSender } from '@/api/hris/authentication/model/repository/change-password-message-sender';
import { type EmployeeRepository } from '@/api/hris/authentication/model/repository/employee-repository.type';
import { ApiError } from '@/shared';
import { StringTools } from '@/shared/utils/string-tools';
import { logger } from '@/shared/service/pino';

export function createChangePasswordRequestUseCase(
  authRepository: ChangePasswordRepository,
  employeeRepository: EmployeeRepository,
  changePasswordMessageSender: ChangePasswordMessageSender,
) {
  return async (email: string) => {
    try {
      const existingEmployee = await employeeRepository.getEmployeeByEmail(email);

      if (!existingEmployee) {
        return;
      }

      const token = StringTools.createRandomString(32);

      await authRepository.createChangePasswordRequest(email, token);
      await changePasswordMessageSender.sendChangePasswordRequestToken({ email, token });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        return;
      }
      logger.error(err);
      throw new ApiError(400, AUTHENTICATION_ERROR_MESSAGES.changePasswordRequest.CHANGE_PASSWORD_FAILED);
    }
  };
}
