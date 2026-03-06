import { type InviteMessageSender, type SendInvitePayload } from '@/api/hris/authentication/model/repository';
import { getEnv } from '@/shared/utils/get-env';
import { notificationsServiceFactory } from '@/shared/service/email/notifications-service.factory';

export function sendInviteService(): InviteMessageSender {
  const appUrl = getEnv('NEXT_PUBLIC_APP_URL', { required: true }).replace(/\/+$/, '');

  return {
    async sendInvite(payload: SendInvitePayload): Promise<void> {
      const appLink = appUrl;

      const notificationsService = await notificationsServiceFactory();
      await notificationsService.sendNotification({
        notificationsServiceSettings: {
          channels: ['EMAIL'],
          severity: 'HIGH',
          recipientEmail: payload.email,
          templateKey: 'auth.invite',
          templateVariables: {
            appLink,
            email: payload.email,
            tempPassword: payload.tempPassword,
          },
        },
        emailSenderPayload: {
          to: payload.email,
          html: {
            template: 'inviteTemplate',
            variables: {
              appLink,
              email: payload.email,
              tempPassword: payload.tempPassword,
            },
          },
        },
      });
    },
  };
}
