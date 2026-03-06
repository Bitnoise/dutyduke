'use client';

import { DictionaryGridList } from '@/lib/ui/components/dictionaries/dictionary-grid-list';
import { DictionaryTable } from '@/lib/ui/components/dictionaries/dictionary-table';
import { type DictionaryEntity } from '@/shared/types/dictionary';
import { type CUID } from '@/shared';
import { deleteCategories } from './_actions/delete-categories.action';

type Props = {
  entities: DictionaryEntity[];
};

export function DocumentCategoriesContent({ entities }: Props) {
  const handleDelete = async (id: CUID) => {
    await deleteCategories([id]);
  };

  return (
    <>
      <DictionaryTable className="hidden md:table" entities={entities} onDelete={handleDelete} />
      <DictionaryGridList className="md:hidden" entities={entities} onDelete={handleDelete} />
    </>
  );
}
