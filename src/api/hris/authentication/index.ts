import {
  type AuthController,
  authController,
} from '@/api/hris/authentication/infrastructure/controllers/auth.controller';
import { type OrganizationContext } from '@/api/hris';

export type AuthApi = AuthController;

export function authApi(organizationContext: OrganizationContext): AuthApi {
  return authController(organizationContext);
}
