import { type CUID } from '@/shared';

export const EMPLOYEE_ERROR_MESSAGES = {
  ARCHIVED: 'Cannot update archived employee',
  UPDATE_FAILED: 'Updating employee failed',
  NOT_FOUND: (id: string) => `Employee with given id ${id} was not found!`,
  ORGANIZATION_NAME_NOT_FOUND: 'Organization name not found',
  DOCUMENTS: {
    UPLOAD_FAILED: `Uploading employee's document has failed.`,
    DELETE_FAILED: `Deleting employee's document has failed.`,
    NOT_FOUND: (id: string) => `Document with given id ${id} was not found!`,
  },
  ALREADY_EXISTS: 'Employee already exists',
  ADDITIONAL_EMAIL_ALREADY_EXISTS: `Email already taken`,
};

export const EMPLOYEE_SKILLS_ERROR_MESSAGES = {
  UPDATE_FAILED: 'errorMessages.employeeSkills.updateFailed',
  PROJECTS: {
    ADD_FAILED: 'Adding project failed',
    NOT_FOUND_BY_ID: (id: CUID) => `Project with id: ${id} was not found`,
    UPDATE_FAILED: 'Updating project failed',
    DELETE_FAILED: 'Deleting project failed',
  },
  EMPLOYMENT_HISTORY: {
    NOT_FOUND_BY_ID: (id: CUID) => `Employment history entry with id: ${id} was not found`,
    ADD_FAILED: 'Adding employment history entry failed',
    UPDATE_FAILED: 'Updating employment history entry failed',
    DELETE_FAILED: 'Deleting employment history entry failed',
  },
  EDUCATION: {
    NOT_FOUND_BY_ID: (id: CUID) => `Education entry with id: ${id} was not found`,
    ADD_FAILED: 'Adding education entry entry failed',
    UPDATE_FAILED: 'Updating education entry failed',
    DELETE_FAILED: 'Deleting education entry failed',
  },
  COURSE: {
    NOT_FOUND_BY_ID: (id: CUID) => `Course with id: ${id} was not found`,
    ADD_FAILED: 'Adding course failed',
    UPDATE_FAILED: 'Updating course failed',
    DELETE_FAILED: 'Deleting course failed',
  },
};

export const EMPLOYEE_EARNINGS_ERROR_MESSAGES = {
  NOT_FOUND_BY_ID: (id: CUID) => `Earning with id: ${id} was not found`,
  UPDATE_FAILED: 'errorMessages.employeeEarnings.updateFailed',
  DELETE_FAILED: 'errorMessages.employeeEarnings.deleteFailed',
};

export const EMPLOYEE_PHOTOS_ERROR_MESSAGES = {
  UPDATE_FAILED: 'Updating employee photos failed',
  PHOTO_NOT_FOUND: (id: string) => `Photo with id: ${id} was not found`,
};
