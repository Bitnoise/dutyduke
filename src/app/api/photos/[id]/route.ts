import { readFile, readdir } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';
import { type NextRequest } from 'next/server';
import { hrisApi } from '@/api/hris';
import { prisma } from '@/api/hris/prisma/client';
import { encodeFilenameForHeader } from '@/shared';

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
};

// Cache for avatar file lookups to avoid repeated directory scans
const avatarCache = new Map<string, string | null>();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const download = searchParams.get('download') !== '0'; // 0 - view 1 - download;
  const dir = searchParams.get('dir');

  try {
    let buffer: Buffer | null = null;
    let fileName: string | undefined;

    if (dir === 'employee') {
      // For employee avatars, read directly from filesystem
      const avatarId = id;
      const mediaDir = '_uploads/media';

      // Check cache first
      let filePath: string | null = avatarCache.get(avatarId) ?? null;

      if (filePath === null && !avatarCache.has(avatarId)) {
        // Not in cache, need to find the file
        const extensions = ['.png', '.jpg', '.jpeg', '.gif'];
        let found = false;

        // Try exact matches first (covers 99% of cases)
        for (const ext of extensions) {
          const possiblePaths = [join(mediaDir, `${avatarId}${ext}`), join(mediaDir, ` ${avatarId}${ext}`)];

          for (const path of possiblePaths) {
            if (existsSync(path)) {
              filePath = path;
              fileName = `${avatarId}${ext}`;
              found = true;
              break;
            }
          }

          if (found) break;
        }

        // If not found with exact match, search for files starting with avatarId
        if (!found) {
          try {
            const files = await readdir(mediaDir);
            const matchingFile = files.find((file) => file.startsWith(avatarId));

            if (matchingFile) {
              filePath = join(mediaDir, matchingFile);
              fileName = matchingFile;
            } else {
              filePath = null;
            }
          } catch (err) {
            console.error('Error reading media directory:', err);
            filePath = null;
          }
        }

        // Cache the result (including null for not found)
        avatarCache.set(avatarId, filePath);
      }

      // Read the file if found in legacy media directory
      if (filePath) {
        buffer = await readFile(filePath);
        if (!fileName) {
          fileName = filePath.split('/').pop();
        }
      } else {
        // Fall back to document system lookup for newly uploaded photos
        const document = await prisma.document.findUnique({ where: { id: avatarId } });

        if (document) {
          const actualFilePath = document.filePath.replace(/^\/uploads\//, '_uploads/');
          buffer = await readFile(actualFilePath);
          fileName = document.filePath.split('/').pop();
        }
      }
    } else {
      // For company logo
      const api = hrisApi;
      const photo = await api.company.getCompanyLogo();

      if (photo) {
        buffer = await api.documents.getFile('persistent-volume', photo.filePath);
        fileName = photo.filePath.split('/').pop();
      }
    }

    if (buffer) {
      const ext = extname(fileName ?? '').toLowerCase();
      const contentType = MIME_TYPES[ext] ?? 'image/png';

      if (download) {
        return new Response(buffer as unknown as BodyInit, {
          headers: {
            'Content-Disposition': `attachment; ${encodeFilenameForHeader(fileName)}`,
            'Content-Type': contentType,
          },
        });
      }

      return new Response(buffer as unknown as BodyInit, {
        headers: {
          'Content-Type': contentType,
        },
      });
    }

    return new Response(null, { status: 404 });
  } catch (error) {
    console.error('Error serving photo:', error);
    return new Response(null, { status: 404 });
  }
}
