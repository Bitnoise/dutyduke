import { type IdentityRepository } from '@/api/hris/authentication/model/repository/identity-repository.type';
import { type AuthenticationRepository } from '@/api/hris/authentication/model/repository/token-repository.type';
import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';
import { ApiError } from '@/shared';
import { type CUID } from '@/api/hris/types';

export function updateIdentityUseCase(
  identityRepository: IdentityRepository,
  authenticationRepository: AuthenticationRepository,
) {
  return async (
    identityId: CUID,
    updates: {
      email?: string;
      password?: string;
    },
  ): Promise<void> => {
    const identity = await identityRepository.getIdentityById(identityId);

    if (!identity) {
      throw new ApiError(404, AUTHENTICATION_ERROR_MESSAGES.identity.NOT_FOUND_BY_ID(identityId));
    }

    // Update email if provided
    if (updates.email !== undefined && updates.email !== identity.getEmail()) {
      const existingIdentity = await identityRepository.findIdentityByEmail(updates.email);
      if (existingIdentity && existingIdentity.getId() !== identityId) {
        throw new ApiError(409, AUTHENTICATION_ERROR_MESSAGES.identity.ALREADY_EXISTS);
      }
      await identityRepository.updateIdentityEmail(identityId, updates.email);
    }

    // Update password if provided
    if (updates.password !== undefined) {
      const hashedPassword = await authenticationRepository.hashPassword(updates.password);
      await identityRepository.updateIdentityPassword(identityId, hashedPassword);
    }
  };
}
