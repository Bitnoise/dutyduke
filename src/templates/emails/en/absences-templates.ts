import { type EmailTemplate } from '..';
import { templateHtml } from '../utils';

export const approveAbsenceTemplate = <EmailTemplate>{
  subject: 'Your absence request has been approved',
  html: templateHtml(
    'Hi {{firstName}}!',
    'Your absence request from {{startDate}} to {{endDate}} ({{days}}d) has been approved.',
  ),
};

export const rejectAbsenceTemplate = <EmailTemplate>{
  subject: 'Your absence request has been rejected',
  html: templateHtml(
    'Hi {{firstName}}!',
    'Your absence request from {{startDate}} to {{endDate}} ({{days}}d) has been rejected.',
  ),
};
