import type { TemplateVariables } from '@/shared/service/templates/email-template.service';

import {
  filePersistenceFactory,
  type FilePersistenceType,
  pdfCreatorService,
} from '@/shared/service/file-persistance';
import { type OrganizationContext } from './../index';
import {
  documentsController,
  type DocumentsController,
} from './infrastructure/controllers/documents.controller';
import { templateService } from './infrastructure/acl/template-service.acl';
import { type DocumentCategoryController, documentCategoryController } from './infrastructure/controllers';

export type DocumentsService = {
  getPdfBuffer: (templateName: string, templateVariables: TemplateVariables) => Promise<Buffer>;
  uploadFile: (type: FilePersistenceType, file: File, dirPath?: string) => Promise<string | null>;
  deleteFile: (type: FilePersistenceType, fileName: string) => Promise<boolean>;
  deleteFileByFilePath: (type: FilePersistenceType, filePath: string) => Promise<boolean>;
  getFile: (type: FilePersistenceType, filePath: string) => Promise<Buffer | null>;
  deleteDirectory: (type: FilePersistenceType, dirPath: string, force?: boolean) => Promise<boolean>;
};

export type DocumentsApi = DocumentsController & DocumentsService & DocumentCategoryController;

export function documentsApi(organizationContext: OrganizationContext): DocumentsApi {
  const { organizationId } = organizationContext;

  return {
    getPdfBuffer: pdfCreatorService(templateService()).getPdfBuffer,
    uploadFile: (type: FilePersistenceType, file: File, dirPath?: string) =>
      filePersistenceFactory(type).uploadFile(organizationId, file, dirPath),
    deleteFile: (type: FilePersistenceType, fileName: string) =>
      filePersistenceFactory(type).deleteFile(organizationId, fileName),
    deleteFileByFilePath: (type: FilePersistenceType, filePath: string) =>
      filePersistenceFactory(type).deleteFileByFilePath(filePath),
    getFile: (type: FilePersistenceType, filePath: string) => filePersistenceFactory(type).getFile(filePath),
    deleteDirectory: (type: FilePersistenceType, dirPath: string, force?: boolean) =>
      filePersistenceFactory(type).deleteDirectory(organizationId, dirPath, force),
    ...documentsController(organizationContext),
    ...documentCategoryController(organizationContext),
  };
}
