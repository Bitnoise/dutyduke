export const ERROR_MESSAGES = {
  INVALID_ID: 'errorMessages.invalidId',
  REQUIRED: 'errorMessages.required',
  CHECK_REQUIRED: 'errorMessages.checkRequired',
  INVALID_DATE: 'errorMessages.invalidDate',
  INVALID_DOCUMENT_SIZE: 'errorMessages.invalidDocumentSize',
  INVALID_DOCUMENT_NAME: 'errorMessages.invalidDocumentName',
  INVALID_PHOTO_SIZE: 'errorMessages.invalidPhotoSize',
  INVALID_EMAIL: 'errorMessages.invalidEmail',
  INVALID_PASSWORD: 'errorMessages.invalidPassword',
  INVALID_PHONE_NUMBER: 'errorMessages.invalidPhoneNumber',
  NOT_MATCHING_PASSWORDS: 'errorMessages.notMatchingPasswords',
  UNKNOWN: 'errorMessages.unknown',
  MISSING_SUBDOMAIN: 'errorMessages.auth.missingSubdomain',
  UNAUTHORIZED: 'errorMessages.auth.unauthorized',
  CURRENCY: {
    TOO_SMALL: 'errorMessages.tooSmall',
    TOO_BIG: 'errorMessages.tooBig',
    INVALID_INPUT: 'errorMessages.invalidValueInput',
  },
  INVALID_CREDENTIALS: 'errorMessages.signInError',
  ACCOUNT_ALREADY_EXISTS: 'errorMessages.userAlreadyExists',
  TOO_SHORT: 'errorMessages.tooShort',
  TOO_LONG: 'errorMessages.tooLong',
  SUBDOMAIN: {
    INVALID: 'errorMessages.invalidSubdomain',
    IS_TAKEN: 'errorMessages.takenSubdomain',
  },
  DELETE_ORGANIZATION_FAILED: 'errorMessages.deleteOrganizationFail',
  EMAIL_ALREADY_TAKEN: 'errorMessages.emailAlreadyTaken',
  EQUIPMENT: {
    ALREADY_EXISTS_BY_SIGNATURE: 'company.equipment.create.errors.alreadyExistsBySignature',
    ALREADY_EXISTS_BY_SERIAL: 'company.equipment.create.errors.alreadyExistsBySerial',
  },
  ABSENCES: {
    DATE_RANGE_OVERLAPS_EXISTING_ABSENCES:
      'absences.settings.create.errors.dateRangeOverlapsExistingAbsences',
  },
  DICTIONARY: {
    ALREADY_EXISTS: (name: string) => `${name} with this name already exists.`,
  },
};

export const API_ERROR_MESSAGES = {
  EMPLOYEES: {
    NOT_FOUND: (id: string) => `Employee with given id ${id} was not found!`,
  },

  ORGANIZATION: {
    NOT_FOUND_ORGANIZATION_DATABASE: 'Organization database was not found.',
    CANNOT_CREATE_ORGANIZATION: 'errorMessages.organization.cannotCreate',
  },

  DOCUMENTS: {
    DELETE_FAILED: 'Deletion of documents failed.',
    DELETE_DOCUMENT_FAILED: (id: string) => `Deletion of document with id ${id} failed.`,
    UPDATE_DOCUMENT_FAILED: (id: string) => `Update of document with id ${id} failed.`,
    UPDATE_FAILED: 'Update of documents failed.',
    NOT_FOUND: (id: string) => `Document with given id ${id} was not found!`,
    NOT_FOUND_MULTIPLE: 'Documents not found.',
    NOT_FOUND_BY_FILEPATH: 'Document could not be found in database.',
  },
  EQUIPMENT: {
    UPDATE_FAILED: 'Update of equipment failed.',
    UPDATE_FAILED_BY_ID: (id: string) => `Update of equipment with id ${id} failed.`,
    NOT_FOUND: (id: string) => `Equipment with given id ${id} was not found!`,
    NOT_FOUND_MULTIPLE: 'Equipment not found.',
    DELETE_CATEGORY_FAILED: (id: string) => `Deletion of equipment category with id ${id} failed.`,
    DELETE_LOCATION_FAILED: (id: string) => `Deletion of equipment location with id ${id} failed.`,
  },
  ABSENCES: {
    FAILED_TO_FETCH: 'Failed to fetch absences data.',
  },
  WORK_ORDERS: {
    FETCHING_FAILED: 'Failed to fetch work orders data.',
  },
  CLIENTS: {
    FAILED_TO_ARCHIVE: 'Failed to archive clients',
  },
  SKILL: {
    DELETE_SKILL_FAILED: (id: string) => `Deletion of skill with id ${id} failed.`,
  },
};
