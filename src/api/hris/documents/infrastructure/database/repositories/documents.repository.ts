import { type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { getFileNameFromFilePath, type CUID } from '@/shared';
import { type DocumentsRepository } from '../../../model/repositories';
import { type UpdateDocumentDto, type DocumentDto } from '../../../model/dtos';

export function documentsRepository(db: OrganizationPrismaClient): DocumentsRepository {
  const createDocument = async (filePath: string, assignedTo?: string, categoryId?: string) => {
    const document: DocumentDto = await db.document.create({
      data: {
        filePath,
        description: getFileNameFromFilePath(filePath),
        assignedTo,
        status: ['ACTIVE'],
        categoryId,
      },
    });

    return document.id;
  };

  const updateDocument = async (id: CUID, data: UpdateDocumentDto) => {
    await db.document.update({
      where: { id },
      data,
    });
  };

  const deleteDocumentById = async (id: CUID) => {
    await db.document.delete({
      where: {
        id,
      },
    });
  };

  const deleteDocuments = async (ids: CUID[]) => {
    await db.document.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  };

  return {
    createDocument,
    updateDocument,
    deleteDocumentById,
    deleteDocuments,
  };
}
