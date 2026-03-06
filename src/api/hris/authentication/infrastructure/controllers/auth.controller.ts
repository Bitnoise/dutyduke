import { type NewIdentityDto } from '@/api/hris/authentication/model/dtos/identity.dto';
import { identityRepository } from '@/api/hris/authentication/infrastructure/database/repositories/identityRepository';
import { type CUID } from '@/api/hris/types';
import { employeeAcl } from '@/api/hris/authentication/infrastructure/acl/employeeAcl';
import { rolesRepository } from '@/api/hris/authentication/infrastructure/database/repositories/rolesRepository';
import { authenticationService } from '@/api/hris/authentication/infrastructure/service/authentication.service';
import { type OrganizationContext } from '@/api/hris';
import { getLoggedIdentityId } from '@/api/hris/authorization';
import { ApiError, ERROR_MESSAGES } from '@/shared';
import { type MeDto } from '@/api/hris/authentication/model/dtos/employee.dto';

import { sendChangePasswordTokenService } from '@/api/hris/authentication/infrastructure/service';
import { changePasswordTokenQueries } from '@/api/hris/authentication/infrastructure/database/queries';
import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';
import { type ChangePasswordSchema } from '@/api/hris/authentication/infrastructure/controllers/schemas';
import {
  changePasswordUseCase,
  changePasswordWithOldPasswordUseCase,
  changeTempPasswordUseCase,
  createChangePasswordRequestUseCase,
  createIdentityUseCase,
  createIdentityManuallyUseCase,
  createOwnerUseCase,
  deleteIdentityUseCase,
  loginWithEmailAndPassword,
  updateIdentityUseCase,
} from '@/api/hris/authentication/model/use-cases';
import { changePasswordRepository } from '@/api/hris/authentication/infrastructure/database/repositories';
import { sendInviteService } from '@/api/hris/authentication/infrastructure/service/invite.service';
import { organizationAcl } from '@/api/hris/authentication/acl';
import { settingsAcl } from '../../acl/seetings.acl';
import { type ChangePasswordDto } from '../../model/dtos/change-password.dto';

export type AuthController = {
  createIdentity: (email: string, roleKey?: string) => Promise<string>;
  createIdentityManually: (email: string, password: string, roleKey?: string) => Promise<string>;
  createOwner: (newUser: NewIdentityDto, adminId: CUID | null) => Promise<void>;
  login: (email: string, password: string) => Promise<string>;
  getMe: () => Promise<MeDto>;
  getIdentityById: (identityId: CUID) => Promise<{ id: CUID; email: string; roles: string[] } | null>;
  getIdentityByEmail: (email: string) => Promise<{ id: CUID; email: string; roles: string[] } | null>;
  createChangePasswordRequest: (email: string) => Promise<void>;
  validateChangePasswordToken: (schema: ChangePasswordSchema) => Promise<void>;
  changePassword: (dto: ChangePasswordDto) => Promise<void>;
  changePasswordWithOldPassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateIdentity: (identityId: CUID, updates: { email?: string; password?: string }) => Promise<void>;
  deleteIdentity: (identityId: CUID) => Promise<void>;
};

export function authController(organizationContext: OrganizationContext): AuthController {
  const identityRepositoryImpl = identityRepository(organizationContext.db);
  const changePasswordTokenQueriesImpl = changePasswordTokenQueries(organizationContext.db);
  const rolesRepo = rolesRepository(organizationContext.db);
  const employeeAclImpl = employeeAcl(organizationContext);
  const authenticationRepository = authenticationService();
  const sendChangePasswordTokenServiceImpl = sendChangePasswordTokenService();
  const sendInviteServiceImpl = sendInviteService();
  const changePasswordRepositoryImpl = changePasswordRepository(organizationContext.db);
  const organizationAclImpl = organizationAcl(organizationContext.organizationId);
  const settingsAclImpl = settingsAcl(organizationContext);

  const createChangePasswordRequest = async (email: string) => {
    const changePasswordRequest = await changePasswordTokenQueriesImpl.getChangePasswordRequestByEmail(email);

    if (changePasswordRequest) {
      await changePasswordRepositoryImpl.clearPendingChangePasswordRequests(changePasswordRequest.email);
    }

    await createChangePasswordRequestUseCase(
      changePasswordRepositoryImpl,
      employeeAclImpl,
      sendChangePasswordTokenServiceImpl,
    )(email);
  };

  const validateChangePasswordToken = async (changePasswordSchema: ChangePasswordSchema) => {
    const pendingChangePasswordRequest =
      await changePasswordTokenQueriesImpl.getActiveChangePasswordRequestByToken(changePasswordSchema.token);

    if (!pendingChangePasswordRequest) {
      throw new ApiError(404, AUTHENTICATION_ERROR_MESSAGES.changePasswordRequest.NO_ACTIVE_REQUEST_FOUND);
    }

    await changePasswordUseCase(changePasswordRepositoryImpl, authenticationRepository)(
      pendingChangePasswordRequest,
      changePasswordSchema.password,
    );
  };

  const changePassword = async (dto: ChangePasswordDto) => {
    const employee = await employeeAclImpl.getEmployeeByEmail(dto.email);

    if (!employee) {
      throw new ApiError(400, AUTHENTICATION_ERROR_MESSAGES.changePasswordRequest.CHANGE_PASSWORD_FAILED);
    }

    await changeTempPasswordUseCase(
      identityRepositoryImpl,
      changePasswordRepositoryImpl,
      authenticationRepository,
      employeeAclImpl,
    )(employee, dto);
  };

  const createIdentity = async (email: string, roleKey?: string) =>
    createIdentityUseCase(
      identityRepositoryImpl,
      rolesRepo,
      authenticationRepository,
      sendInviteServiceImpl,
      organizationAclImpl,
    )({ email }, roleKey);

  const createIdentityManually = async (email: string, password: string, roleKey?: string) =>
    createIdentityManuallyUseCase(
      identityRepositoryImpl,
      rolesRepo,
      authenticationRepository,
      organizationAclImpl,
    )(email, password, roleKey);

  const getIdentityById = async (identityId: CUID) => {
    const identity = await identityRepositoryImpl.getIdentityById(identityId);
    if (!identity) {
      return null;
    }
    return {
      id: identity.getId(),
      email: identity.getEmail(),
      roles: identity.getPayload().roles,
    };
  };

  const getIdentityByEmail = async (email: string) => {
    const identity = await identityRepositoryImpl.findIdentityByEmail(email);
    if (!identity) {
      return null;
    }
    return {
      id: identity.getId(),
      email: identity.getEmail(),
      roles: identity.getPayload().roles,
    };
  };

  const updateIdentity = async (identityId: CUID, updates: { email?: string; password?: string }) => {
    await updateIdentityUseCase(identityRepositoryImpl, authenticationRepository)(identityId, updates);
  };

  const deleteIdentity = async (identityId: CUID) => {
    await deleteIdentityUseCase(identityRepositoryImpl, organizationAclImpl)(identityId);
  };

  const changePasswordWithOldPassword = async (oldPassword: string, newPassword: string) => {
    const identityId = await getLoggedIdentityId();
    await changePasswordWithOldPasswordUseCase(
      identityRepositoryImpl,
      changePasswordRepositoryImpl,
      authenticationRepository,
    )(identityId, oldPassword, newPassword);
  };

  return {
    createChangePasswordRequest,
    validateChangePasswordToken,
    createIdentity,
    createIdentityManually,
    getIdentityById,
    getIdentityByEmail,
    updateIdentity,
    changePassword,
    changePasswordWithOldPassword,
    deleteIdentity,
    createOwner: async (newIdentityDto: NewIdentityDto, adminId: CUID | null = null): Promise<void> => {
      await createOwnerUseCase(
        identityRepositoryImpl,
        rolesRepo,
        employeeAclImpl,
        authenticationRepository,
      )(newIdentityDto, adminId);
    },
    login: async (email: string, password: string): Promise<string> => {
      return loginWithEmailAndPassword(authenticationRepository, identityRepositoryImpl)(email, password);
    },
    getMe: async () => {
      const identityId = await getLoggedIdentityId();

      const identity = await identityRepositoryImpl.getIdentityById(identityId);

      if (!identity) {
        throw new ApiError(401, ERROR_MESSAGES.UNAUTHORIZED);
      }

      const employee = await employeeAclImpl.getEmployeeByEmail(identity.getEmail());
      const [locale, dateFormat] = await Promise.all([
        settingsAclImpl.getLocale(),
        settingsAclImpl.getDateFormat(),
      ]);
      return {
        ...employee,
        locale,
        dateFormat,
        roles: identity.getPayload().roles,
      };
    },
  };
}
