import { emailSenderService, type EmailSenderService } from '@/shared/service/email/email-sender.service';
import { nodemailerClient } from '@/shared/service/email/nodemailer.client';
import { emailTemplateService } from '@/shared/service/templates/email-template.service';
import { templates } from '@/templates/emails';
import { getUserLocale } from '@/shared/service/locale/user-locale.service';

export async function emailServiceFactory(): Promise<EmailSenderService> {
  const language = await getUserLocale();
  const emailClient = nodemailerClient();
  const templateService = emailTemplateService(templates, language);

  return emailSenderService(emailClient, templateService);
}
