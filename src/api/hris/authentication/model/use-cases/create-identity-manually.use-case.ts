import { type IdentityRepository } from '@/api/hris/authentication/model/repository/identity-repository.type';
import { type RolesRepository } from '@/api/hris/authentication/model/repository/roles-repository.type';
import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';
import { type AuthenticationRepository } from '@/api/hris/authentication/model/repository/token-repository.type';
import { type OrganizationAcl } from '@/api/hris/authentication/model/acl';
import { ApiError } from '@/shared';

export function createIdentityManuallyUseCase(
  identityRepository: IdentityRepository,
  rolesRepository: RolesRepository,
  authenticationRepository: AuthenticationRepository,
  organizationAcl: OrganizationAcl,
) {
  return async (email: string, password: string, roleKey?: string): Promise<string> => {
    const existingIdentity = await identityRepository.findIdentityByEmail(email);

    if (existingIdentity) {
      throw new ApiError(409, AUTHENTICATION_ERROR_MESSAGES.identity.ALREADY_EXISTS);
    }

    const hashedPassword = await authenticationRepository.hashPassword(password);

    const identityId = await identityRepository.createIdentity({
      email,
      password: hashedPassword,
    });

    // Assign roles by key if provided
    if (roleKey) {
      await rolesRepository.addRoleByKey(identityId, roleKey);
    }

    await organizationAcl.addUser(email);

    return identityId;
  };
}
