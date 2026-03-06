import { type CUID } from '@/shared';

export const DOCUMENTS_ERRORS = {
  NOT_FOUND_BY_ID: (id: CUID) => `Document with id: ${id} was not found.`,
  NOT_FOUND: 'Document not found.',
  NONE_SELECTED: 'There are no documents selected.',
  ARCHIVED: 'Cannot update archived document.',
  NOT_ATTACHED: 'No files were attached.',
  CANNOT_UPDATE_ARCHIVED: 'Cannot update archived documents!',
};

export const DOCUMENTS_CATEGORY_ERRORS = {
  ALREADY_EXISTS: (name: string) => `Category with given name: ${name} already exists.`,
};
