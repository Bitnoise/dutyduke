import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';
import { type ChangePasswordRepository } from '@/api/hris/authentication/model/repository';
import { type IdentityRepository } from '@/api/hris/authentication/model/repository/identity-repository.type';
import { type AuthenticationRepository } from '@/api/hris/authentication/model/repository/token-repository.type';
import { ApiError } from '@/shared';
import { logger } from '@/shared/service/pino';
import { type CUID } from '@/api/hris/types';

export function changePasswordWithOldPasswordUseCase(
  identityRepository: IdentityRepository,
  changePasswordRepository: ChangePasswordRepository,
  authenticationRepository: AuthenticationRepository,
) {
  return async (identityId: CUID, oldPassword: string, newPassword: string) => {
    const identity = await identityRepository.getIdentityById(identityId);

    if (!identity) {
      throw new ApiError(404, AUTHENTICATION_ERROR_MESSAGES.identity.NOT_FOUND_BY_ID(identityId));
    }

    const isPasswordValid = await authenticationRepository.verifyPassword(
      oldPassword,
      identity.getPassword(),
    );

    if (!isPasswordValid) {
      throw new ApiError(400, AUTHENTICATION_ERROR_MESSAGES.identity.INVALID_CREDENTIALS);
    }

    const hashedPassword = await authenticationRepository.hashPassword(newPassword);

    try {
      await changePasswordRepository.changePassword(identity.getEmail(), hashedPassword);
    } catch (err) {
      logger.error(err);
      throw new ApiError(400, AUTHENTICATION_ERROR_MESSAGES.changePasswordRequest.CHANGE_PASSWORD_FAILED);
    }
  };
}
