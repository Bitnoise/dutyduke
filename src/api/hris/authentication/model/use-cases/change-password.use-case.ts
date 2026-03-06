import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';
import { type ChangePasswordRepository } from '@/api/hris/authentication/model/repository';
import { type AuthenticationRepository } from '@/api/hris/authentication/model/repository/token-repository.type';
import { type ChangePasswordRequest } from '@/api/hris/prisma/client';
import { ApiError } from '@/shared';
import { logger } from '@/shared/service/pino';

export function changePasswordUseCase(
  identityRepository: ChangePasswordRepository,
  authenticationRepository: AuthenticationRepository,
) {
  return async (request: ChangePasswordRequest, password: string) => {
    const hashedPassword = await authenticationRepository.hashPassword(password);

    try {
      await identityRepository.changePassword(request.email, hashedPassword);
      await identityRepository.clearPendingChangePasswordRequests(request.email);
    } catch (err) {
      logger.error(err);
      throw new ApiError(400, AUTHENTICATION_ERROR_MESSAGES.changePasswordRequest.CHANGE_PASSWORD_FAILED);
    }
  };
}
