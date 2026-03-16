import {
  type EmailTemplateService,
  type TemplateVariables,
} from '@/shared/service/templates/email-template.service';
import { type EmployeeCVPayload } from '@/templates/pdf/cv';

import { buildCvPdf } from './cv-pdf-builder';

export function pdfCreatorService(_templateService: EmailTemplateService) {
  const getPdfBuffer = async (
    templateName: string,
    templateVariables: TemplateVariables,
  ): Promise<Buffer> => {
    if (templateName === 'cv') {
      return buildCvPdf(templateVariables as unknown as EmployeeCVPayload);
    }

    throw new Error(`PDF generation not implemented for template: ${templateName}`);
  };

  return {
    getPdfBuffer,
  };
}
