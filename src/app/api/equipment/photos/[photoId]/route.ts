import { type NextRequest } from 'next/server';
import { hrisApi } from '@/api/hris';
import { encodeFilenameForHeader } from '@/shared';

export async function GET(request: NextRequest, { params }: { params: { photoId: string } }) {
  const searchParams = request.nextUrl.searchParams;
  const download = searchParams.get('download') !== '0'; // 0 - view 1 - download;

  const api = hrisApi;
  const photo = await api.documents.getDocumentById(params.photoId);

  if (!photo) return new Response();

  // Convert database path format (/uploads/...) to actual filesystem path (_uploads/...)
  const actualFilePath = photo.filePath.replace(/^\/uploads\//, '_uploads/');
  const buffer = await api.documents.getFile('persistent-volume', actualFilePath);

  if (download) {
    const fileName = photo.filePath.split('/').pop();

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        'Content-Disposition': `attachment; ${encodeFilenameForHeader(fileName)}`,
      },
    });
  }

  return new Response(buffer as unknown as BodyInit);
}
