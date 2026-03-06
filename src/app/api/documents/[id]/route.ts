import path from 'path';
import { type NextRequest } from 'next/server';
import { hrisApi } from '@/api/hris';
import { API_ERROR_MESSAGES, ApiError, VIEWABLE_FILE_EXTENSIONS, encodeFilenameForHeader } from '@/shared';

const MIME_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const api = hrisApi;

  const document = await api.documents.getDocumentById(params.id);

  if (!document) {
    throw new ApiError(404, API_ERROR_MESSAGES.DOCUMENTS.NOT_FOUND(params.id));
  }

  const ext = path.extname(document.filePath);
  const fileName = document.filePath.split('/').pop();

  // Convert database path format (/uploads/...) to actual filesystem path (_uploads/...)
  const actualFilePath = document.filePath.replace(/^\/uploads\//, '_uploads/');
  const buffer = await api.documents.getFile('persistent-volume', actualFilePath);

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': MIME_TYPES[ext],
      'Content-Disposition': `${VIEWABLE_FILE_EXTENSIONS.has(ext) ? 'inline' : 'attachment'}; ${encodeFilenameForHeader(fileName)}`,
    },
  });
}
