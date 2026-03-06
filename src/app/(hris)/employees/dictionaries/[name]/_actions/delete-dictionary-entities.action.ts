'use server';

import { revalidatePath } from 'next/cache';
import { type CUID } from '@/shared/types/cuid';
import { hrisApi } from '@/api/hris';
import { HRIS_ROUTES } from '@/shared';
import { logger } from '@/shared/service/pino';
import {
  deleteDictionaryEntityProvider,
  type DictionaryArea,
  type DictionaryName,
} from '@/shared/service/dictionaries/dictionaries.service';

export async function deleteDictionaryEntities(ids: CUID[], dictionaryName: string) {
  const api = hrisApi;

  for (const id of ids) {
    try {
      await deleteDictionaryEntityProvider(
        api,
        'employees',
        dictionaryName as DictionaryName<DictionaryArea>,
        id,
      );
    } catch (error) {
      logger.error(error);
    }
  }

  revalidatePath(HRIS_ROUTES.employees.dictionaries.base(dictionaryName));
}
