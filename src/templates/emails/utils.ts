export function templateHtml(
  heading: string,
  content: string,
  cta?: { label: string; href: string },
): string {
  return `
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0px; padding:0px;">
    <div style="margin:0px; font-family: 'Roboto', Arial, sans-serif; background: #F0F3F7; height: 100vh; width: 100vw; display: flex; justify-content: center; flex-direction: column; align-items: center; padding: 16px 24px;">
    <div style="padding-bottom:40px">
      DutyDuke
    </div>
    <div style="width:752px; height: fit-content; width: fit-content; margin: 0 auto; padding: 24px; background: white;">
        <p style="color: #242C32; font-size: 20px; font-weight: 500;">
          ${heading}
        </p>
        <div style="color: #516170;">
          ${content}
        </div>
        ${
          cta
            ? `
        <div style="align-self: center; padding: 24px;">
          <a href="${cta.href}" style="width: fit-content; color: white; background: #405E96; display: flex; margin: 0 auto; height: 36px; align-items: center; padding: 0px 16px; font-size: 14px; letter-spacing: 1px; text-decoration: none;">
            ${cta.label}
          </a>
        </div>
        `
            : ''
        }
      </div>
    </div>
    </body>
  `;
}
