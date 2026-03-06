import {
  emailTemplateService,
  type EmailTemplateService,
} from '@/shared/service/templates/email-template.service';
import { templates } from '@/templates/pdf';
import { DEFAULT_LANGUAGE } from '@/shared/constants/languages';

export { type EmailTemplateService } from '@/shared/service/templates/email-template.service';

export const templateService = (): EmailTemplateService => emailTemplateService(templates, DEFAULT_LANGUAGE);
