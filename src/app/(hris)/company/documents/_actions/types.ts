import { type ActionReturnType, type ActionReturnValidationErrorsType, type Nullable } from '@/shared';
import { type DeleteDocumentSchema, type AddDocumentSchema, type EditDocumentSchema } from '../_schemas';

export type AddDocumentsForm = {
  category: Nullable<string>;
  description: Nullable<string>;
  expirationDate: Nullable<Date>;
  documents: File[];
};

export type AddDocumentState = ActionReturnType<
  AddDocumentSchema,
  undefined,
  ActionReturnValidationErrorsType<AddDocumentSchema>
>;

export type EditDocumentsForm = {
  category: Nullable<string>;
  description: Nullable<string>;
  expirationDate: Nullable<Date>;
  documents: 'all' | string[];
};

export type EditDocumentState = ActionReturnType<
  EditDocumentSchema,
  undefined,
  ActionReturnValidationErrorsType<EditDocumentSchema>
>;

export type DeleteDocumentState = ActionReturnType<
  DeleteDocumentSchema,
  undefined,
  ActionReturnValidationErrorsType<DeleteDocumentSchema>
>;
