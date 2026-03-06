'use client';

import { DictionaryBulkActions } from '@/lib/ui/components/dictionaries/dictionary-bulk-actions';
import { createDictionaryEntity } from '../_actions/create-dictionary-entity.action';
import { deleteDictionaryEntities } from '../_actions/delete-dictionary-entities.action';

export function DictionaryBulkActionsContent({ name }: { name: string }) {
  return (
    <DictionaryBulkActions
      actions={['create', 'delete']}
      dictionaryName={name}
      onCreateEntity={(prevState, formData) => createDictionaryEntity(prevState, formData, name)}
      onDeleteEntities={(ids) => deleteDictionaryEntities(ids, name)}
    />
  );
}
