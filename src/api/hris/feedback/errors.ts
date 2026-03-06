export const FEEDBACK_ERROR_MESSAGES = {
  NOT_FOUND: (id: string) => `Feedback with id ${id} was not found`,
  CREATE_FAILED: 'Creating feedback failed',
  UPDATE_FAILED: 'Updating feedback failed',
  DELETE_FAILED: 'Deleting feedback failed',
  INVALID_TYPE: 'Invalid feedback type',
  INVALID_DATE: 'Invalid planned date',
  HOST_REQUIRED: 'Host is required',
  PERSON_REQUIRED: 'Person is required',
  NOTES_REQUIRED_FOR_OTHER: 'Notes are required for "other" type feedback',
  FEEDBACK_SCORE_REQUIRED_FOR_OTHER: 'Feedback score is required for "other" type feedback',
};
