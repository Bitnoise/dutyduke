import { getEnv } from '@/shared/utils/get-env';

export const ITEMS_PER_PAGE = +(getEnv('ITEMS_PER_PAGE') ?? 20);
export const ALL_ITEMS_PER_PAGE = +(getEnv('ALL_ITEMS_PER_PAGE') ?? 100000);
