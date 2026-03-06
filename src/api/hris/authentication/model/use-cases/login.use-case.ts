import { type AuthenticationRepository } from '@/api/hris/authentication/model/repository/token-repository.type';
import { type IdentityRepository } from '@/api/hris/authentication/model/repository/identity-repository.type';
import { AUTHENTICATION_ERROR_MESSAGES } from '@/api/hris/authentication/errors';

export function loginWithEmailAndPassword(
  authenticationRepository: AuthenticationRepository,
  identityRepository: IdentityRepository,
) {
  return async (email: string, password: string): Promise<string> => {
    const identity = await identityRepository.findIdentityByEmail(email);
    if (!identity) {
      throw new Error(AUTHENTICATION_ERROR_MESSAGES.identity.INVALID_CREDENTIALS);
    }

    const storedPassword = identity.getPassword();
    const isPasswordValid = await authenticationRepository.verifyPassword(password, storedPassword);

    if (!isPasswordValid) {
      throw new Error(AUTHENTICATION_ERROR_MESSAGES.identity.INVALID_CREDENTIALS);
    }

    return authenticationRepository.signToken(identity.getId(), identity.getPayload());
  };
}
