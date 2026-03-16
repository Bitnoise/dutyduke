import PDFDocument from 'pdfkit';
import { type EmployeeCVPayload } from '@/templates/pdf/cv';

const COLORS = {
  black: '#000000' as const,
  text: '#333333' as const,
  muted: '#555555' as const,
};

const FONTS = {
  regular: 'Helvetica',
  bold: 'Helvetica-Bold',
};

const PAGE = {
  marginLeft: 56,
  marginRight: 56,
  marginTop: 40,
  marginBottom: 40,
};

const SECTION_GAP = 18;
const LIST_ITEM_GAP = 14;
const PERIOD_COLUMN_WIDTH = 80;
const PERIOD_GAP = 16;

type CVLabels = {
  personalData: string;
  skillsProfile: string;
  primarySkills: string;
  secondarySkills: string;
  languages: string;
  recentProjects: string;
  experience: string;
  education: string;
  name: string;
  in: string;
  company: string;
};

const EN_LABELS: CVLabels = {
  personalData: 'PERSONAL DATA',
  skillsProfile: 'SKILLS PROFILE',
  primarySkills: 'Primary skills',
  secondarySkills: 'Secondary skills',
  languages: 'Languages',
  recentProjects: 'RECENT PROJECTS',
  experience: 'JOB EXPERIENCE',
  education: 'EDUCATION',
  name: 'Name',
  in: 'in',
  company: 'Company',
};

function drawSectionHeader(doc: PDFKit.PDFDocument, title: string) {
  ensureSpace(doc, 40);
  doc.font(FONTS.bold).fontSize(13).fillColor(COLORS.black).text(title, PAGE.marginLeft, doc.y);

  const y = doc.y + 2;
  doc
    .moveTo(PAGE.marginLeft, y)
    .lineTo(PAGE.marginLeft + 100, y)
    .lineWidth(1.5)
    .strokeColor(COLORS.black)
    .stroke();

  doc.y = y + 10;
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  const pageHeight = doc.page.height - PAGE.marginBottom;
  if (doc.y + needed > pageHeight) {
    doc.addPage();
  }
}

function getContentWidth(doc: PDFKit.PDFDocument) {
  return doc.page.width - PAGE.marginLeft - PAGE.marginRight;
}

export function buildCvPdf(payload: EmployeeCVPayload, labels: CVLabels = EN_LABELS): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: PAGE.marginTop,
        bottom: PAGE.marginBottom,
        left: PAGE.marginLeft,
        right: PAGE.marginRight,
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const contentWidth = getContentWidth(doc);

    // === HEADER ===
    doc
      .font(FONTS.bold)
      .fontSize(26)
      .fillColor(COLORS.black)
      .text(payload.companyName, PAGE.marginLeft, PAGE.marginTop);

    doc
      .font(FONTS.regular)
      .fontSize(16)
      .fillColor(COLORS.text)
      .text(payload.position, PAGE.marginLeft, doc.y + 2);

    doc.y += SECTION_GAP;

    // === PERSONAL DATA ===
    drawSectionHeader(doc, labels.personalData);

    const displayName = payload.isAnonymized
      ? `${payload.firstName} ${payload.lastNameFirstLetter}.`
      : `${payload.firstName} ${payload.lastName}`;

    doc
      .font(FONTS.bold)
      .fontSize(10)
      .fillColor(COLORS.text)
      .text(`${labels.name}: ${displayName}`, PAGE.marginLeft, doc.y);

    if (payload.description) {
      doc.y += 4;
      doc
        .font(FONTS.regular)
        .fontSize(9)
        .fillColor(COLORS.text)
        .text(payload.description, PAGE.marginLeft, doc.y, { width: contentWidth, lineGap: 2 });
    }

    doc.y += SECTION_GAP;

    // === SKILLS PROFILE ===
    const hasSkills =
      payload.primarySkills?.length > 0 ||
      payload.secondarySkills?.length > 0 ||
      payload.languages?.length > 0;

    if (hasSkills) {
      drawSectionHeader(doc, labels.skillsProfile);

      const columns: { title: string; items: string[] }[] = [];
      if (payload.primarySkills?.length > 0) {
        columns.push({ title: labels.primarySkills, items: payload.primarySkills });
      }
      if (payload.secondarySkills?.length > 0) {
        columns.push({ title: labels.secondarySkills, items: payload.secondarySkills });
      }
      if (payload.languages?.length > 0) {
        columns.push({
          title: labels.languages,
          items: payload.languages.map((l) => `${l.name} - ${l.level}`),
        });
      }

      const colWidth = contentWidth / Math.max(columns.length, 1);
      const startY = doc.y;

      let maxBottomY = startY;
      columns.forEach((col, i) => {
        const x = PAGE.marginLeft + i * colWidth;
        doc
          .font(FONTS.bold)
          .fontSize(10)
          .fillColor(COLORS.black)
          .text(col.title, x, startY, { width: colWidth - 10 });

        let itemY = doc.y + 4;
        col.items.forEach((item) => {
          doc
            .font(FONTS.regular)
            .fontSize(9)
            .fillColor(COLORS.text)
            .text(`•  ${item}`, x + 4, itemY, { width: colWidth - 14 });
          itemY = doc.y + 3;
        });
        if (itemY > maxBottomY) maxBottomY = itemY;
      });

      doc.y = maxBottomY + SECTION_GAP;
    }

    // === RECENT PROJECTS ===
    if (payload.projects?.length > 0) {
      drawSectionHeader(doc, labels.recentProjects);

      payload.projects.forEach((project, idx) => {
        ensureSpace(doc, 40);
        const rowY = doc.y;

        doc
          .font(FONTS.regular)
          .fontSize(9)
          .fillColor(COLORS.muted)
          .text(project.period, PAGE.marginLeft, rowY, { width: PERIOD_COLUMN_WIDTH });

        const detailX = PAGE.marginLeft + PERIOD_COLUMN_WIDTH + PERIOD_GAP;
        const detailWidth = contentWidth - PERIOD_COLUMN_WIDTH - PERIOD_GAP;

        doc
          .font(FONTS.bold)
          .fontSize(9)
          .fillColor(COLORS.text)
          .text(`${project.position} ${labels.in} ${project.name}`, detailX, rowY, {
            width: detailWidth,
          });

        if (project.description) {
          doc.y += 2;
          doc
            .font(FONTS.regular)
            .fontSize(9)
            .fillColor(COLORS.text)
            .text(project.description, detailX, doc.y, { width: detailWidth, lineGap: 1 });
        }

        doc.y += idx < payload.projects.length - 1 ? LIST_ITEM_GAP : 0;
      });

      doc.y += SECTION_GAP;
    }

    // === JOB EXPERIENCE ===
    if (payload.experience?.length > 0) {
      drawSectionHeader(doc, labels.experience);

      payload.experience.forEach((exp, idx) => {
        ensureSpace(doc, 40);
        const rowY = doc.y;
        const period = `${exp.from} - ${exp.to || 'now'}`;

        doc
          .font(FONTS.regular)
          .fontSize(9)
          .fillColor(COLORS.muted)
          .text(period, PAGE.marginLeft, rowY, { width: PERIOD_COLUMN_WIDTH });

        const detailX = PAGE.marginLeft + PERIOD_COLUMN_WIDTH + PERIOD_GAP;
        const detailWidth = contentWidth - PERIOD_COLUMN_WIDTH - PERIOD_GAP;

        doc
          .font(FONTS.bold)
          .fontSize(9)
          .fillColor(COLORS.text)
          .text(exp.position, detailX, rowY, { width: detailWidth });

        doc
          .font(FONTS.regular)
          .fontSize(9)
          .fillColor(COLORS.text)
          .text(`${labels.company}: ${exp.company}`, detailX, doc.y + 1, { width: detailWidth });

        if (exp.description) {
          doc.y += 2;
          doc
            .font(FONTS.regular)
            .fontSize(9)
            .fillColor(COLORS.text)
            .text(exp.description, detailX, doc.y, { width: detailWidth, lineGap: 1 });
        }

        doc.y += idx < payload.experience.length - 1 ? LIST_ITEM_GAP : 0;
      });

      doc.y += SECTION_GAP;
    }

    // === EDUCATION ===
    if (payload.education?.length > 0) {
      drawSectionHeader(doc, labels.education);

      payload.education.forEach((edu, idx) => {
        ensureSpace(doc, 40);
        const rowY = doc.y;
        const period = `${edu.from} - ${edu.to || 'present'}`;

        doc
          .font(FONTS.regular)
          .fontSize(9)
          .fillColor(COLORS.muted)
          .text(period, PAGE.marginLeft, rowY, { width: PERIOD_COLUMN_WIDTH });

        const detailX = PAGE.marginLeft + PERIOD_COLUMN_WIDTH + PERIOD_GAP;
        const detailWidth = contentWidth - PERIOD_COLUMN_WIDTH - PERIOD_GAP;

        doc
          .font(FONTS.regular)
          .fontSize(9)
          .fillColor(COLORS.text)
          .text(edu.description, detailX, rowY, { width: detailWidth, lineGap: 1 });

        doc.y += idx < payload.education.length - 1 ? LIST_ITEM_GAP : 0;
      });
    }

    doc.end();
  });
}
