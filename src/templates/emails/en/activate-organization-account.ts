import { type EmailTemplate } from '../index';
import { templateHtml } from '../utils';

export const activateOrganizationAccount = <EmailTemplate>{
  subject: 'Activate your organization account',
  html: templateHtml(
    'Hi {{firstName}} {{lastName}}!',
    `Thank you for creating an account with us for you company "{{companyName}}". To activate your account, please click on the link below.`,
    {
      label: 'Confirm email',
      href: '{{activationLink}}',
    },
  ),
};

export const changePasswordTemplate = <EmailTemplate>{
  subject: 'Change Password Request for your DutyDuke account',
  html: templateHtml(
    'We have received a request to change the password for your account in DutyDuke',
    `
      <ol>
        <li>Click on the link below to change your password</li>
        <li><p>If you did not request a password change, please disregard this email. Your current password remains secure, and no changes have been made to your account.</p></li>
      </ol>
  `,
    { label: 'Change password', href: '{{changePasswordLink}}' },
  ),
};

export const inviteTemplate = <EmailTemplate>{
  subject: 'Welcome to DutyDuke - Your Access Details',
  html: templateHtml(
    'You have been invited to DutyDuke application',
    `
      <p>You have been invited to DutyDuke application</p>
      <p>Login Details:</p>
      <p>Email: {{email}}</p>
      <p>Temporary Password: {{tempPassword}}</p>
    `,
  ),
};
