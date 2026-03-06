import { type CUID } from '@/shared';

export const AUTHENTICATION_ERROR_MESSAGES = {
  identity: {
    ALREADY_EXISTS: 'errorMessages.auth.identityAlreadyExists',
    INVALID_CREDENTIALS: 'errorMessages.auth.invalidCredentials',
    UNAUTHORIZED: 'errorMessages.auth.unauthorized',
    NOT_FOUND_BY_ID: (id: CUID) => `Identity by id ${id} was not found.`,
    DELETE_FAILED: 'Deleting identity has failed',
  },
  organization: {
    NOT_FOUND: 'errorMessages.organization.notFound',
    user: {
      notFound: (email: string) => `User with email: ${email} was not found in given organization`,
    },
  },

  changePasswordRequest: {
    NO_ACTIVE_REQUEST_FOUND: 'No active change password found.',
    CHANGE_PASSWORD_FAILED: 'Change password failed',
  },

  UNKNOWN: 'Server error',
};
