import { type IdentityRepository } from '@/api/hris/authentication/model/repository/identity-repository.type';
import { type CreateIdentityDto } from '@/api/hris/authentication/model/dtos/identity.dto';
import { type RolesRepository } from '@/api/hris/authentication/model/repository/roles-repository.type';
import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';
import { type AuthenticationRepository } from '@/api/hris/authentication/model/repository/token-repository.type';
import { StringTools } from '@/shared/utils/string-tools';
import { type InviteMessageSender } from '@/api/hris/authentication/model/repository';
import { type OrganizationAcl } from '@/api/hris/authentication/model/acl';
import { ApiError } from '@/shared';

export function createIdentityUseCase(
  identityRepository: IdentityRepository,
  rolesRepository: RolesRepository,
  authenticationRepository: AuthenticationRepository,
  sendInviteService: InviteMessageSender,
  organizationAcl: OrganizationAcl,
) {
  return async ({ email }: CreateIdentityDto, roleKey?: string): Promise<string> => {
    const existingIdentity = await identityRepository.findIdentityByEmail(email);

    if (existingIdentity) {
      throw new ApiError(409, AUTHENTICATION_ERROR_MESSAGES.identity.ALREADY_EXISTS);
    }

    const tempPassword = StringTools.createRandomString(12);

    await sendInviteService.sendInvite({ email, tempPassword });

    const hashedPassword = await authenticationRepository.hashPassword(tempPassword);

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
