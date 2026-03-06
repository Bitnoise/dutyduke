import { type CUID } from '@/shared';

export const EQUIPMENT_CATEGORY_ERRORS = {
  ALREADY_EXISTS: (name: string) => `Category with name: ${name} already exists`,
  CREATE_FAILED: 'Creating category failed.',
};

export const EQUIPMENT_ERRORS = {
  ALREADY_EXISTS_BY_SIGNATURE: (signature: string) => `Equipment with signature: ${signature} already exists`,
  ALREADY_EXISTS_BY_SERIAL: (serial: string) => `Equipment with serial: ${serial} already exists`,
  NOT_FOUND_BY_ID: (id: CUID) => `Equipment with id: ${id} was not found.`,
  NOT_FOUND: 'Equipment not found.',
  CREATE_FAILED: 'Creating equipment failed.',
  UPDATE_FAILED: 'Updating equipment failed.',
  ASSIGN_FAILED: 'Assigning equipment failed.',
  UNASSIGN_FAILED: 'Unassigning equipment failed.',
  ARCHIVED: 'Cannot update archived equipment.',
  DOCUMENTS: {
    UPLOAD_FAILED: `Uploading equipment's document has failed.`,
    DELETE_FAILED: `Deleting equipments's document has failed.`,
    NOT_FOUND: (id: string) => `Document with given id ${id} was not found!`,
  },
};

export const EQUIPMENT_CHANGELOG_ERRORS = {
  CREATE_FAILED: 'Creating equipment log failed.',
};

export const EQUIPMENT_LOCATION_ERRORS = {
  CREATE_FAILED: 'Creating equipment location failed.',
  ALREADY_EXISTS_BY_NAME: (name: string) => `Equipment location: ${name} already exists.`,
};
