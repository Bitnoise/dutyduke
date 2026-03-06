import { type CUID } from '@/shared';

export const BENEFIT_ERRORS = {
  NOT_FOUND: (id: CUID) => `Benefit with id ${id} was not found.`,
  NOT_FOUND_BY_ID: (id: CUID) => `Benefit with id ${id} was not found.`,
  CREATE_FAILED: 'Creating benefit failed.',
  UPDATE_FAILED: 'Updating benefit failed.',
  DELETE_FAILED: 'Deleting benefit failed.',
  ASSIGN_FAILED: 'Assigning benefit failed.',
  UNASSIGN_FAILED: 'Unassigning benefit failed.',
  ALREADY_ASSIGNED: 'This benefit has already been assigned!',
};
