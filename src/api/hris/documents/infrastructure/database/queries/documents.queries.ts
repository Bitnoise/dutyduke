import dayjs from 'dayjs';
import { type OrganizationContext } from '@/api/hris';
import {
  containsQuery,
  type CUID,
  DOCUMENTS_WARNING_BADGE_TIME,
  type DocumentsOrderBy,
  getPaginatedData,
  ITEMS_PER_PAGE,
  type Nullable,
  type OrderBy,
  type Paginated,
  parseSort,
} from '@/shared';
import { type DocumentStatus, type OrganizationPrisma } from '@/api/hris/prisma/client';
import {
  type DocumentsAssignStatus,
  type DocumentsStatus,
  type DocumentDto,
  type DocumentsListDto,
  type DocumentsListItemDto,
} from '../../../model/dtos';
import { employeesAcl } from '../../acl/employees.acl';

export type DocumentsQueries = {
  getDocuments: (
    ids: string[],
    page: number,
    orderBy?: Extract<OrderBy, 'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'>,
    perPage?: number,
  ) => Promise<Paginated<DocumentDto>>;
  getDocumentById: (id: CUID) => Promise<Nullable<DocumentDto>>;
  getDocumentByFilePath: (filePath: string) => Promise<Nullable<DocumentDto>>;
  getDocumentsList: (
    page: number,
    orderBy: DocumentsOrderBy,
    statusFilter: DocumentsStatus[],
    assignFilter: DocumentsAssignStatus[],
    categoryId: Nullable<CUID>,
    query?: string,
    expDate?: boolean,
    perPage?: number,
  ) => Promise<DocumentsListDto>;
  getAllDocuments: (
    status: DocumentStatus[],
    filter: DocumentsAssignStatus[],
    category?: string,
  ) => Promise<DocumentDto[]>;
};

export function documentsQueries(organizationContext: OrganizationContext): DocumentsQueries {
  const { db } = organizationContext;

  const employeesAclImpl = employeesAcl(organizationContext);

  const getDocuments = async (
    ids: CUID[],
    page: number = 1,
    orderBy: Extract<
      OrderBy,
      'createdAt-asc' | 'createdAt-desc' | 'expDate-asc' | 'expDate-desc'
    > = 'createdAt-asc',
    perPage: number = ITEMS_PER_PAGE,
  ) => {
    const [documents, totalItems] = await Promise.all([
      db.document.findMany({
        take: perPage,
        skip: (page - 1) * perPage,
        where: { id: { in: ids } },
        orderBy: parseSort(orderBy),
      }),
      db.document.count({ where: { id: { in: ids } } }),
    ]);

    const documentsWithExtension = documents.map((doc) => {
      const fileName = doc.filePath.split('/').pop() || '';
      const extension = fileName.includes('.') ? fileName.split('.').pop()!.toLowerCase() : '';
      return {
        ...doc,
        extension,
      };
    });

    return getPaginatedData(documentsWithExtension, page, totalItems);
  };

  const getDocumentById = async (id: CUID) => db.document.findUnique({ where: { id } });

  const getDocumentByFilePath = async (filePath: string) => db.document.findFirst({ where: { filePath } });

  const getDocumentsList = async (
    page: number,
    orderBy: DocumentsOrderBy,
    statusFilter: DocumentsStatus[],
    assignFilter: DocumentsAssignStatus[],
    categoryId: Nullable<CUID>,
    query?: string,
    expDate?: boolean,
    perPage: number = ITEMS_PER_PAGE,
  ) => {
    const handleCustomCategoryFilter = (): OrganizationPrisma.DocumentWhereInput => {
      if (!categoryId) {
        return {};
      }
      return { categoryId: categoryId.toLowerCase() };
    };

    const handleFilterByAssignFilter = (): OrganizationPrisma.DocumentWhereInput => {
      if (
        assignFilter.includes('ASSIGNED') &&
        assignFilter.includes('FREE') &&
        categoryId !== 'EMPLOYEE' &&
        categoryId !== 'EQUIPMENT'
      ) {
        return {};
      }

      if (assignFilter.includes('ASSIGNED')) {
        return {
          assignedTo: { not: null },
        };
      }

      if (assignFilter.includes('FREE')) {
        return {
          assignedTo: null,
        };
      }

      return {};
    };

    const handleFilterByStatus = (): OrganizationPrisma.DocumentWhereInput => {
      if (!statusFilter || !statusFilter.length) {
        return {};
      }

      const OR: OrganizationPrisma.DocumentWhereInput[] = [
        {
          status: { hasSome: statusFilter },
        },
      ];

      if (statusFilter.includes('ACTIVE')) {
        OR.push({ NOT: { status: { hasSome: ['ARCHIVED'] } } });
      }

      if (statusFilter.includes('EXPIRING_SOON')) {
        OR.push({
          NOT: { status: { hasSome: ['ARCHIVED'] } },
          expDate: { gt: new Date(), lte: dayjs().add(DOCUMENTS_WARNING_BADGE_TIME, 'day').toDate() },
        });
      }

      if (statusFilter.includes('EXPIRED')) {
        OR.push({
          NOT: { status: { hasSome: ['ARCHIVED'] } },
          expDate: { lte: new Date() },
        });
      }

      return { OR };
    };

    const [documentsList, totalItems] = await Promise.all([
      db.document.findMany({
        select: {
          id: true,
          expDate: true,
          description: true,
          status: true,
          categoryId: true,
          createdAt: true,
          filePath: true,
          assignedTo: true,
          documentCategory: {
            select: {
              name: true,
            },
          },
        },
        orderBy: parseSort(orderBy),
        where: {
          ...handleFilterByStatus(),
          ...handleCustomCategoryFilter(),
          ...handleFilterByAssignFilter(),
          ...(expDate && { expDate: { not: null } }),
        },
        take: perPage,
        skip: (page - 1) * perPage,
      }),
      db.document.count({
        where: {
          ...handleFilterByStatus(),
          ...handleCustomCategoryFilter(),
          ...handleFilterByAssignFilter(),
        },
      }),
    ]);

    const parsedQuery = query?.length ? decodeURIComponent(query) : undefined;

    // Collect all documents that have an assignedTo employee ID (CUID format)
    const documentIdsForEmployee = documentsList
      .filter((doc) => doc.assignedTo && doc.assignedTo.length > 10) // Filter for CUID-like strings
      .map((doc) => doc.id);

    const employeesByDocumentId =
      documentIdsForEmployee.length > 0
        ? await Promise.all(
            documentIdsForEmployee.map((id) =>
              employeesAclImpl.getEmployeeByDocumentId(id).then((employee) => [id, employee]),
            ),
          ).then((entries) => Object.fromEntries(entries))
        : {};

    const parsedDocumentsList: DocumentsListItemDto[] = documentsList
      .map((document) => {
        const { documentCategory, id, assignedTo, ...restDocument } = document;

        const fileName = document.filePath.split('/').pop() || '';
        const extension = fileName.includes('.') ? fileName.split('.').pop()!.toLowerCase() : '';

        return {
          ...restDocument,
          extension,
          id,
          category: documentCategory ? documentCategory.name : '-',
          assignedTo: assignedTo ? (employeesByDocumentId[id] ?? null) : null,
        };
      })
      .filter((doc) => !parsedQuery || containsQuery(doc, parsedQuery));

    return getPaginatedData(parsedDocumentsList, page, totalItems, perPage);
  };

  const getAllDocuments = async (
    status: DocumentStatus[],
    filter: DocumentsAssignStatus[],
    category?: string,
  ) => {
    const whereAssignStatus =
      filter.includes('ASSIGNED') && filter.includes('FREE')
        ? {}
        : { assigneeId: filter.includes('ASSIGNED') ? { not: null } : null };

    const documents = await db.document.findMany({
      where: {
        categoryId: category,
        status: {
          hasSome: status,
        },
        ...whereAssignStatus,
      },
    });

    return documents;
  };

  return {
    getDocuments,
    getDocumentById,
    getDocumentByFilePath,
    getDocumentsList,
    getAllDocuments,
  };
}
