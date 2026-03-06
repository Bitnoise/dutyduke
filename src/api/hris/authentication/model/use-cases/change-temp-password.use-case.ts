import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';
import { type EmployeeDto } from '@/api/hris/authentication/model/dtos/employee.dto';
import {
  type EmployeeRepository,
  type ChangePasswordRepository,
  type IdentityRepository,
} from '@/api/hris/authentication/model/repository';
import { type AuthenticationRepository } from '@/api/hris/authentication/model/repository/token-repository.type';
import { ApiError } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type ChangePasswordDto } from '../dtos/change-password.dto';

export function changeTempPasswordUseCase(
  identityRepository: IdentityRepository,
  changePasswordRepository: ChangePasswordRepository,
  authenticationRepository: AuthenticationRepository,
  employeeAcl: EmployeeRepository,
) {
  return async (employee: EmployeeDto, changePasswordDto: ChangePasswordDto) => {
    const identity = await identityRepository.findIdentityByEmail(employee.email);
    if (!identity) {
      throw new ApiError(400, AUTHENTICATION_ERROR_MESSAGES.changePasswordRequest.CHANGE_PASSWORD_FAILED);
    }

    const hashedPassword = await authenticationRepository.hashPassword(changePasswordDto.password);

    try {
      await changePasswordRepository.changePassword(employee.email, hashedPassword);
    } catch (err) {
      logger.error(err);
      throw new ApiError(400, AUTHENTICATION_ERROR_MESSAGES.changePasswordRequest.CHANGE_PASSWORD_FAILED);
    }

    try {
      await employeeAcl.changeStatus(employee.id, 'ACTIVE');
    } catch (err) {
      logger.error(err);
      // change password back to the temporary password on failed attempt
      await changePasswordRepository.changePassword(employee.email, identity.getPassword());

      throw new ApiError(400, AUTHENTICATION_ERROR_MESSAGES.changePasswordRequest.CHANGE_PASSWORD_FAILED);
    }
  };
}
