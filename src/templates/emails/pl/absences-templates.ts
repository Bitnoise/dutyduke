import { type EmailTemplate } from '..';
import { templateHtml } from '../utils';

export const approveAbsenceTemplate = <EmailTemplate>{
  subject: 'Twoja prośba o nieobecność została zatwierdzona',
  html: templateHtml(
    'Cześć {{firstName}}!',
    'Twoja prośba o nieobecność w dniach od {{startDate}} do {{endDate}} ({{days}}d) została zatwierdzona.',
  ),
};

export const rejectAbsenceTemplate = <EmailTemplate>{
  subject: 'Twoja prośba o nieobecność została odrzucona',
  html: templateHtml(
    'Cześć {{firstName}}!',
    'Twoja prośba o nieobecność w dniach od {{startDate}} do {{endDate}} ({{days}}d) została odrzucona.',
  ),
};
