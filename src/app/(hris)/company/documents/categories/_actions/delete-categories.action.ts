'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { type CUID } from '@/api/hris/types';
import { HRIS_ROUTES } from '@/shared';

export async function deleteCategories(ids: CUID[] | 'all') {
  const api = hrisApi;

  await api.documents.deleteCategories(ids);

  revalidatePath(HRIS_ROUTES.documents.categories);
}
