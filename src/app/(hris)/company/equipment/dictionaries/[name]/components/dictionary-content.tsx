'use client';

import { useRouter } from 'next/navigation';
import { DictionaryTable } from '@/lib/ui/components/dictionaries/dictionary-table';
import { DictionaryGridList } from '@/lib/ui/components/dictionaries/dictionary-grid-list';
import { type DictionaryEntity } from '@/shared/types/dictionary';
import { NoResults } from '@/lib/ui';
import { deleteEntity } from '../_actions';

type Props = {
  entities: DictionaryEntity[];
  dictionaryName: string;
  totalItems: number;
};

export function DictionaryContent({ entities, dictionaryName, totalItems }: Props) {
  const router = useRouter();

  const handleDelete = async (itemId: string) => {
    await deleteEntity(itemId, dictionaryName);
    router.refresh();
  };

  return (
    <>
      <DictionaryTable className="hidden xl:table" entities={entities} onDelete={handleDelete} />
      <DictionaryGridList className="xl:hidden" entities={entities} onDelete={handleDelete} />
      {totalItems === 0 && <NoResults />}
    </>
  );
}
