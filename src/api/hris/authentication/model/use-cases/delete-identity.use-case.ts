import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';
import { type OrganizationAcl } from '@/api/hris/authentication/model/acl';
import { type IdentityRepository } from '@/api/hris/authentication/model/repository';
import { ApiError, type CUID } from '@/shared';
import { logger } from '@/shared/service/pino';

export function deleteIdentityUseCase(
  identityRepository: IdentityRepository,
  organizationAcl: OrganizationAcl,
) {
  return async (identityId: CUID) => {
    const identity = await identityRepository.getIdentityById(identityId);

    if (!identity) return;

    // Try to delete user from organization ACL if it exists
    // If user doesn't exist in organization ACL, that's okay - just proceed with identity deletion
    const user = await organizationAcl.getUserByEmail(identity.getEmail());
    if (user) {
      try {
        await organizationAcl.deleteUser(user.id);
      } catch (err) {
        logger.info(err);
        // Log error but continue with identity deletion
      }
    }

    try {
      const isAdmin = identity.getPayload().roles.includes('OWNER');

      await identityRepository.deleteIdentity(identity.getId(), isAdmin);
    } catch (err) {
      logger.info(err);
      // If identity deletion fails and user was deleted from org ACL, try to restore it
      if (user) {
        try {
          await organizationAcl.addUser(identity.getEmail());
        } catch (restoreErr) {
          logger.info(restoreErr);
        }
      }
      throw new ApiError(500, AUTHENTICATION_ERROR_MESSAGES.identity.DELETE_FAILED);
    }
  };
}
