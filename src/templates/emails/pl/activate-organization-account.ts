import { type EmailTemplate } from '../index';
import { templateHtml } from '../utils';

export const activateOrganizationAccount = <EmailTemplate>{
  subject: 'Aktywuj konto Twojej organizacji',
  html: templateHtml(
    'Witaj {{firstName}} {{lastName}}!',
    `Dziękujemy za utworzenie konta dla Twojej firmy "{{companyName}}". Aby aktywować konto, kliknij w poniższy link.`,
    {
      label: 'Potwierdź email',
      href: '{{activationLink}}',
    },
  ),
};

export const changePasswordTemplate = <EmailTemplate>{
  subject: 'Prośba o zmianę hasła do Twojego konta DutyDuke',
  html: templateHtml(
    'Otrzymaliśmy prośbę o zmianę hasła do Twojego konta w DutyDuke',
    `
      <ol>
        <li>Kliknij w poniższy link, aby zmienić hasło</li>
        <li>Jeśli nie prosiłeś/aś o zmianę hasła, zignoruj tę wiadomość. Twoje obecne hasło pozostaje bezpieczne i nie wprowadzono żadnych zmian na Twoim koncie.</li>
      </ol>
  `,
    { label: 'Zmień hasło', href: '{{changePasswordLink}}' },
  ),
};

export const inviteTemplate = <EmailTemplate>{
  subject: 'Witamy w aplikacji DutyDuke - Twoje dane dostępowe',
  html: templateHtml(
    'Zostałeś/aś zaproszony/a do aplikacji DutyDuke',
    `
      <p>Zostałeś/aś zaproszony/a do aplikacji DutyDuke</p>
      <p>Dane logowania:</p>
      <p>Aplikacja: {{appLink}}</p>
      <p>Email: {{email}}</p>
      <p>Tymczasowe hasło: {{tempPassword}}</p>
    `,
  ),
};
