import * as nodemailer from 'nodemailer';
import { type Transporter } from 'nodemailer';
import { getEnv } from '@/shared/utils/get-env';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export type EmailClient = Transporter<SMTPTransport.SentMessageInfo>;
export function nodemailerClient(): EmailClient {
  return nodemailer.createTransport({
    service: 'SMTP',
    host: getEnv('mailer_smtp_host', { required: true }),
    secure: getEnv('mailer_smtp_isSecure', { required: true }) === 'true',
    port: <number>parseInt(getEnv('mailer_smtp_port', { required: true })),
    auth: {
      user: getEnv('mailer_smtp_user', { required: true }),
      pass: getEnv('mailer_smtp_password', { required: true }),
    },
    // tls: {
    //   secureProtocol: 'TLSv1_method',
    // },
  });
}
