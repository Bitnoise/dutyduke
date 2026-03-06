import { type EmailSenderService } from '@/shared/service/email/email-sender.service';
import { emailServiceFactory } from '@/shared/service/email/email-sender.factory';

// Re-export the type for use in use cases
export type { EmailSenderService } from '@/shared/service/email/email-sender.service';

// Export async function that creates the email service
export async function emailSenderService(): Promise<EmailSenderService> {
  return await emailServiceFactory();
}
