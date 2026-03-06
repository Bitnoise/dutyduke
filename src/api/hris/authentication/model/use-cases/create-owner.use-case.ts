import { type IdentityRepository } from '@/api/hris/authentication/model/repository/identity-repository.type';
import { type CUID } from '@/api/hris/types';
import { type NewIdentityDto } from '@/api/hris/authentication/model/dtos/identity.dto';
import { type RolesRepository } from '@/api/hris/authentication/model/repository/roles-repository.type';
import { type EmployeeRepository } from '@/api/hris/authentication/model/repository/employee-repository.type';
import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';
import { type AuthenticationRepository } from '@/api/hris/authentication/model/repository/token-repository.type';

export function createOwnerUseCase(
  identityRepository: IdentityRepository,
  rolesRepository: RolesRepository,
  employeeRepository: EmployeeRepository,
  authenticationRepository: AuthenticationRepository,
) {
  return async (newIdentity: NewIdentityDto, adminId: CUID | null = null): Promise<void> => {
    const existingIdentity = await identityRepository.findIdentityByEmail(newIdentity.email);

    if (existingIdentity) {
      throw new Error(AUTHENTICATION_ERROR_MESSAGES.identity.ALREADY_EXISTS);
    }

    const hashedPassword = await authenticationRepository.hashPassword(newIdentity.password);

    const identityId = await identityRepository.createIdentity({
      email: newIdentity.email,
      password: hashedPassword,
    });

    // Assign OWNER role by key (role must be seeded first)
    await rolesRepository.addRoleByKey(identityId, 'OWNER');

    if (adminId) {
      await identityRepository.addOrganizationAdmin(adminId, identityId);
    }

    await employeeRepository.createEmployee({
      identityId,
      firstName: newIdentity.employee.firstName,
      lastName: newIdentity.employee.lastName,
      email: newIdentity.email,
      status: newIdentity.employee.status,
    });
  };
}
