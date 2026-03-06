import {
  type EmailTemplateService,
  type TemplateVariables,
} from '@/shared/service/templates/email-template.service';

// TODO: Implement PDF generation with an alternative library (e.g., puppeteer, pdf-lib, jspdf)
export function pdfCreatorService(_templateService: EmailTemplateService) {
  const getPdfBuffer = async (
    _templateName: string,
    _templateVariables: TemplateVariables,
  ): Promise<Buffer> => {
    throw new Error('PDF generation not implemented - Playwright was removed');
  };

  return {
    getPdfBuffer,
  };
}
