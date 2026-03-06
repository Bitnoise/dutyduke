import { logger } from '@/shared/service/pino';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
  ) {
    super(`${status}: ${message}`);
    logger.error({ status, message }, 'Api Error thrown');
  }
}
