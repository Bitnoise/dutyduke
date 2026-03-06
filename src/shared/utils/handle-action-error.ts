import {
  type ActionApiErrorReturnType,
  ApiError,
  ERROR_MESSAGES,
  type ActionErrorReturnType,
} from '@/shared';

/**
 * parse vague error to an error that UI can use
 * @param err - error object
 * @returns valid error structure to UI from server action
 */

export function handleActionError(err: unknown): ActionErrorReturnType | ActionApiErrorReturnType {
  if (err instanceof ApiError) {
    return {
      status: 'api-error',
      code: err.status,
      error: err.message,
    };
  }

  if (err instanceof Error) {
    return {
      status: 'error',
      error: err.message,
    };
  }

  return {
    status: 'error',
    error: ERROR_MESSAGES.UNKNOWN,
  };
}
