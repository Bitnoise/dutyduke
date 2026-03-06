import { mkdir, writeFile, unlink, readFile, readdir, rm } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { type CUID } from '@/shared';
import { type FileUpload, type ErrorCallback } from '@/api/hris/documents/model/service/file-upload.type';
import { logger } from '@/shared/service/pino';

export function persistentVolumeService(): FileUpload {
  const persistentVolumeBasePath = '_uploads';

  const init = async (organizationId: CUID, onError?: ErrorCallback) => {
    const dirPath = join(persistentVolumeBasePath, organizationId);

    try {
      await mkdir(dirPath, { recursive: true });

      return true;
    } catch (err) {
      onError?.(err);
      return false;
    }
  };

  const uploadFile = async (
    organizationId: CUID,
    file: File,
    dirPath: string = '',
    onError?: ErrorCallback,
  ) => {
    try {
      // For documents, skip organizationId and upload directly to _uploads/documents
      const fullDirPath =
        dirPath === 'documents'
          ? join(persistentVolumeBasePath, dirPath)
          : join(persistentVolumeBasePath, organizationId, dirPath);

      if (!existsSync(fullDirPath)) {
        await mkdir(fullDirPath, { recursive: true });
      }

      // Ensure file.name is not undefined
      const fileName = file.name || 'unnamed-file';
      const filePath = join(fullDirPath, fileName);

      const fileBuffer = await file.arrayBuffer();

      await writeFile(filePath, new Uint8Array(fileBuffer));

      return filePath;
    } catch (err) {
      logger.info(err);
      onError?.(err);

      return null;
    }
  };

  const uploadBuffer = async (
    organizationId: CUID,
    fileName: string,
    buffer: Buffer,
    dirPath: string = '',
    onError?: ErrorCallback,
  ) => {
    try {
      // For documents, skip organizationId and upload directly to _uploads/documents
      const fullDirPath =
        dirPath === 'documents'
          ? join(persistentVolumeBasePath, dirPath)
          : join(persistentVolumeBasePath, organizationId, dirPath);

      if (!existsSync(fullDirPath)) {
        await mkdir(fullDirPath, { recursive: true });
      }

      // Ensure fileName is not undefined
      const safeFileName = fileName || 'unnamed-file';
      const filePath = join(fullDirPath, safeFileName);

      await writeFile(filePath, new Uint8Array(buffer));

      return filePath;
    } catch (err) {
      logger.info(err);
      onError?.(err);

      return null;
    }
  };

  const deleteFile = async (organizationId: CUID, fileName: string, onError?: ErrorCallback) => {
    try {
      const filePath = join(persistentVolumeBasePath, organizationId, fileName);

      await unlink(filePath);

      return true;
    } catch (err) {
      onError?.(err);

      return false;
    }
  };

  const deleteDirectory = async (
    organizationId: CUID,
    dirPath: string,
    force: boolean = false,
    onError?: ErrorCallback,
  ) => {
    try {
      const fullDirPath = join(persistentVolumeBasePath, organizationId, dirPath);

      await rm(fullDirPath, { recursive: true, force });

      return true;
    } catch (err) {
      onError?.(err);

      return false;
    }
  };

  const deleteFileByFilePath = async (filePath: string, onError?: ErrorCallback) => {
    try {
      await unlink(filePath);

      return true;
    } catch (err) {
      onError?.(err);

      return false;
    }
  };

  const getFile = async (filePath: string, onError?: ErrorCallback) => {
    try {
      const fileContent = await readFile(filePath);

      return fileContent;
    } catch (err) {
      onError?.(err);
      return null;
    }
  };

  const getAllFileNames = async (organizationId: CUID, onError?: ErrorCallback) => {
    try {
      const dirPath = join(persistentVolumeBasePath, organizationId);

      const fileNames = await readdir(dirPath);

      return fileNames;
    } catch (err) {
      onError?.(err);

      return [] as string[];
    }
  };

  return {
    init,
    uploadFile,
    uploadBuffer,
    deleteFile,
    deleteFileByFilePath,
    getFile,
    getAllFileNames,
    deleteDirectory,
  };
}
