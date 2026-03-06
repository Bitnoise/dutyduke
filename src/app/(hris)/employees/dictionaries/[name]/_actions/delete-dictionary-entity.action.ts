'use server';

import { type CUID } from '@/shared/types/cuid';
import { hrisApi } from '@/api/hris';
import { logger } from '@/shared/service/pino';
import {
  deleteDictionaryEntityProvider,
  type DictionaryName,
  type DictionaryArea,
} from '@/shared/service/dictionaries/dictionaries.service';

export async function deleteEntity(id: CUID, dictionaryName: string) {
  const api = hrisApi;

  try {
    await deleteDictionaryEntityProvider(
      api,
      'employees',
      dictionaryName as DictionaryName<DictionaryArea>,
      id,
    );
    return { status: 'success', data: null };
  } catch (error) {
    logger.error(error);
    return { status: 'error', error: 'Failed to delete entity' };
  }
}
