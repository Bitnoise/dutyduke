'use server';

import { type CUID } from '@/shared/types/cuid';
import { hrisApi } from '@/api/hris';
import { logger } from '@/shared/service/pino';
import {
  deleteDictionaryEntityProvider,
  type DictionaryArea,
  type DictionaryName,
} from '@/shared/service/dictionaries/dictionaries.service';

export async function deleteEntity(id: CUID, dictionaryName: string) {
  const api = hrisApi;

  try {
    await deleteDictionaryEntityProvider(
      api,
      'resources',
      dictionaryName as DictionaryName<DictionaryArea>,
      id,
    );
    return { status: 'success', data: null };
  } catch (error) {
    logger.error(error);
    return { status: 'error', error: 'Failed to delete entity' };
  }
}
