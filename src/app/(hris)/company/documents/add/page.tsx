import { type PropsWithChildren } from 'react';
import { getTranslations } from '@/shared/service/locale/get-translations';
import { hrisApi } from '@/api/hris';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { AddFileForm } from '../_forms';
import { DEFAULT_CATEGORY_PRIORITY, DOCUMENTS_CATEGORIES_PRIORITY } from '../_constants';

export default async function AddNewFilePage({}: PropsWithChildren) {
  const api = hrisApi;
  const t = await getTranslations('company.documents');

  const [categories, me] = await Promise.all([
    api.documents.getAllCategories(undefined, undefined, 'all'),
    api.auth.getMe(),
  ]);

  const parsedCategories = [
    ...categories.items
      .map(({ id, name }) => ({ key: id, label: name }))
      .sort(
        (a, b) =>
          (DOCUMENTS_CATEGORIES_PRIORITY[a.label] || DEFAULT_CATEGORY_PRIORITY) -
          (DOCUMENTS_CATEGORIES_PRIORITY[b.label] || DEFAULT_CATEGORY_PRIORITY),
      ),
  ];

  return (
    <div className="min-h-full gap-x-1">
      <BasicHeader>{t('addFiles')}</BasicHeader>
      <p className="pt-4 text-sm">{t('addFileDescription')}</p>
      <AddFileForm categories={parsedCategories} dateFormat={me.dateFormat} />
    </div>
  );
}
