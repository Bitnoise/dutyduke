import { type NextRequest } from 'next/server';
import JSZip from 'jszip';
import { hrisApi } from '@/api/hris';
import { encodeFilenameForHeader } from '@/shared';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const selectedEmployees = searchParams.get('employees') ?? '';
  const anonymize = searchParams.get('anonymize') !== '0'; // by default anonymize is true

  const parsedSelectedEmployees =
    selectedEmployees === 'all' ? selectedEmployees : selectedEmployees?.split(',').filter(Boolean);

  const api = hrisApi;

  const getZipped = (files: Array<{ buffer: Buffer; filename: string }>) => {
    const zip = new JSZip();

    files.forEach((file) => zip.file(file.filename, file.buffer));

    return zip.generateAsync({ type: 'arraybuffer' });
  };

  if (parsedSelectedEmployees === 'all') {
    const employees = await api.employees.getAllEmployees();

    const files = await Promise.all(
      employees.map(({ id }) => api.employees.getEmployeeCvPdfBuffer(id, anonymize)),
    );

    const zip = await getZipped(files);

    return new Response(zip, {
      headers: {
        'Content-Disposition': `attachment; filename="CVS.zip"`,
      },
    });
  }

  if (parsedSelectedEmployees.length === 1) {
    const { buffer, filename } = await api.employees.getEmployeeCvPdfBuffer(
      parsedSelectedEmployees[0],
      anonymize,
    );

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        'Content-Disposition': `attachment; ${encodeFilenameForHeader(filename)}`,
      },
    });
  }

  const files = await Promise.all(
    parsedSelectedEmployees.map((id) => api.employees.getEmployeeCvPdfBuffer(id, anonymize)),
  );

  const zip = await getZipped(files);

  return new Response(zip as unknown as BodyInit, {
    headers: {
      'Content-Disposition': `attachment; filename="CVS.zip"`,
    },
  });
}
