import {
  type ChangePasswordMessageSender,
  type ChangePasswordPayload,
} from '@/api/hris/authentication/model/repository/change-password-message-sender';
import { AUTH_ROUTES } from '@/shared';
import { getEnv } from '@/shared/utils/get-env';
import { notificationsServiceFactory } from '@/shared/service/email/notifications-service.factory';

export function sendChangePasswordTokenService(): ChangePasswordMessageSender {
  const appUrl = getEnv('NEXT_PUBLIC_APP_URL', { required: true }).replace(/\/+$/, '');

  return {
    async sendChangePasswordRequestToken(payload: ChangePasswordPayload): Promise<void> {
      const changePasswordLink = `${appUrl}${AUTH_ROUTES.resetPassword(payload.token)}`;

      const notificationsService = await notificationsServiceFactory();
      await notificationsService.sendNotification({
        notificationsServiceSettings: {
          channels: ['EMAIL'],
          severity: 'HIGH',
          recipientEmail: payload.email,
          templateKey: 'auth.reset-password',
          templateVariables: {
            changePasswordLink,
          },
        },
        emailSenderPayload: {
          to: payload.email,
          html: {
            template: 'changePasswordTemplate',
            variables: {
              changePasswordLink,
            },
          },
        },
      });
    },
  };
}
