import { type LanguageTemplates, type Template } from '@/shared/service/templates/email-template.service';
import { cvEn } from '@/templates/pdf/cv/en';

export type PdfTemplate = Template & {
  html: string;
};

export const templates: LanguageTemplates = {
  en: {
    cv: cvEn,
  },
  pl: {
    cv: cvEn,
  },
};
