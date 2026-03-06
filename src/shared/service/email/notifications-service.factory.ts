import { getUserLocale } from '@/shared/service/locale/user-locale.service';
import { getEnv } from '@/shared/utils/get-env';
import { type SendEmailPayload } from '@/shared/service/email/email-sender.service';
import { emailSenderService } from '@/api/hris/acl/email-service.acl';
import { logger } from '@/shared/service/pino';

type NotificationSettings = {
  channels: ['EMAIL' | 'IN-APP'];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  templateKey: string;
  templateVariables: object;
  recipientEmail: string;
  tenant?: string;
};

export type SendNotificationSettings = {
  notificationsServiceSettings?: NotificationSettings;
  emailSenderPayload?: SendEmailPayload;
};
export type EmailSenderService = {
  sendNotification: (settings: SendNotificationSettings) => Promise<void>;
};

export async function notificationsServiceFactory(): Promise<EmailSenderService> {
  const useNotificationsService = getEnv('USE_NOTIFICATIONS_SERVICE') === 'true';
  const notificationsUrl = getEnv('NOTIFICATIONS_SERVICE_URL');
  const applicationName = getEnv('NOTIFICATIONS_SERVICE_APPLICATION_NAME');
  const applicationToken = getEnv('NOTIFICATIONS_SERVICE_APPLICATION_TOKEN');

  async function sendNotification({
    notificationsServiceSettings,
    emailSenderPayload,
  }: SendNotificationSettings) {
    if (useNotificationsService && notificationsServiceSettings) {
      if (notificationsUrl && applicationName && applicationToken) {
        await sendNotificationThroughNotificationsService(notificationsServiceSettings);
      } else {
        logger.error('Notifications Service config is missing');
        throw new Error('Notifications Service config is missing');
      }
    }
    if (!useNotificationsService && !!emailSenderPayload) {
      const emailService = await emailSenderService();
      await emailService.sendEmail(emailSenderPayload);
    }
  }

  async function sendNotificationThroughNotificationsService(settings: NotificationSettings): Promise<void> {
    const { channels, severity, templateKey, templateVariables, recipientEmail, tenant } = settings;

    const locale = await getUserLocale();
    // Single organization - use tenant if provided, otherwise use default
    const tenantName = tenant ?? 'default';

    try {
      await fetch(notificationsUrl, {
        method: 'POST',
        body: JSON.stringify({
          channels: channels,
          severity: severity,
          recipientUser: {
            email: recipientEmail,
            preferableLanguage: locale.toUpperCase(),
          },
          template: {
            key: templateKey,
            variables: templateVariables,
          },
        }),
        headers: {
          'Content-type': 'application/json',
          tenant: tenantName,
          application: applicationName,
          token: applicationToken,
        },
      });
    } catch (error) {
      logger.error('Failed sending notification:', error);
      throw new Error('Sending notification through Notifications Service failed');
    }
  }

  return {
    sendNotification,
  };
}
