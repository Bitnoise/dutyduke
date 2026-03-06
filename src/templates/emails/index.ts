import { en } from '@/templates/emails/en';
import { pl } from '@/templates/emails/pl';
import { type LanguageTemplates, type Template } from '@/shared/service/templates/email-template.service';

export type EmailTemplate = Template & {
  subject: string;
  html: string;
};

export const templates: LanguageTemplates = {
  en,
  pl,
};
