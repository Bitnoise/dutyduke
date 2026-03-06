import { type OrganizationContext } from '@/api/hris';
import { privateRoute, type PermissionChecker } from '@/api/hris/authorization';
import { type Paginated, type CUID } from '@/shared';
import { type DocumentCategoryDto } from '../../model/dtos';
import { documentsCategoryQueries } from '../database/queries';
import { createDocumentCategoryUseCase } from '../../model/use-cases';
import { documentCategoryRepository } from '../database/repositories';
import { deleteDocumentCategoryUseCase } from '../../model/use-cases/delete-document-category.use-case';

export type DocumentCategoryController = {
  getAllCategories(
    query?: string,
    page?: number,
    itemsPerPage?: number | 'all',
  ): Promise<Paginated<DocumentCategoryDto>>;
  createDocumentCategory: (name: string) => Promise<CUID>;
  deleteCategories: (ids: CUID[] | 'all') => Promise<void>;
};

export function documentCategoryController(
  organizationContext: OrganizationContext,
): DocumentCategoryController {
  const documentCategoryQueriesImpl = documentsCategoryQueries(organizationContext.db);
  const documentCategoryRepositoryImpl = documentCategoryRepository(organizationContext.db);

  const createDocumentCategory = async (checker: PermissionChecker, name: string) =>
    createDocumentCategoryUseCase(documentCategoryRepositoryImpl)(name);

  const getAllCategories = async (
    checker: PermissionChecker,
    query?: string,
    page?: number,
    itemsPerPage?: number | 'all',
  ) => {
    const parsedQuery = query ? decodeURIComponent(query) : undefined;

    return documentCategoryQueriesImpl.getAllCategories(parsedQuery, page, itemsPerPage);
  };

  const deleteCategories = async (checker: PermissionChecker, ids: CUID[] | 'all') => {
    await deleteDocumentCategoryUseCase(documentCategoryRepositoryImpl)(ids);
  };

  return {
    getAllCategories: privateRoute(getAllCategories),
    createDocumentCategory: privateRoute(createDocumentCategory),
    deleteCategories: privateRoute(deleteCategories),
  };
}
