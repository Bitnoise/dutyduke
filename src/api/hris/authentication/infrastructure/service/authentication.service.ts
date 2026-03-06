import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { type CUID } from '@/api/hris/types';
import { type AuthenticationRepository } from '@/api/hris/authentication/model/repository/token-repository.type';
import { getEnv } from '@/shared/utils/get-env';

export function authenticationService(): AuthenticationRepository {
  const jwtSecret = getEnv('JWT_SECRET', { required: true });
  return {
    signToken: async (identityId: CUID, payload: unknown): Promise<string> => {
      return jwt.sign(
        {
          sub: identityId,
          payload,
        },
        jwtSecret,
        {
          expiresIn: '8h',
        },
      );
    },
    hashPassword: async (password: string): Promise<string> => {
      const salt = crypto.randomBytes(32).toString('hex');
      const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

      return `${hashPassword}:${salt}`;
    },
    verifyPassword: async (password: string, hash: string): Promise<boolean> => {
      // Handle potential encryption/decryption issues
      if (!hash || !password) {
        return false;
      }

      // Split hash by colon to get hashValue and salt
      const parts = hash.split(':');
      if (parts.length !== 2) {
        // Hash format is invalid - might be corrupted by encryption
        // Log for debugging
        try {
          const logger = (await import('@/shared/service/pino')).logger;
          logger.info('Password hash format invalid', {
            hashLength: hash.length,
            hashPreview: hash.substring(0, 100),
            partsCount: parts.length,
            hashContainsColon: hash.includes(':'),
          });
        } catch (_e) {
          // Ignore logging errors
        }
        return false;
      }

      const [hashValue, salt] = parts;
      if (!hashValue || !salt) {
        return false;
      }

      const checkHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

      return checkHash === hashValue;
    },
  };
}
