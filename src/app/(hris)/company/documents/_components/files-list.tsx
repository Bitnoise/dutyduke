'use client';

import { ListBox, ListBoxItem } from 'react-aria-components';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Icon } from '@/lib/ui';
import { type FileData } from '@/shared/types/file';
import { type CUID } from '@/shared';

type Props = {
  data: FileData[];
  onDeleteFile: (id: CUID) => void;
};

export function FilesList({ data, onDeleteFile }: Props) {
  const t = useTranslations('labels');
  if (!data.length) return null;
  return (
    <>
      <p>{t('filesList')}:</p>
      <ListBox key={data.length} aria-label="list of uploaded files" items={data}>
        {(item) => (
          <ListBoxItem
            key={item.id}
            aria-label="uploaded file"
            className="mb-1 flex w-full cursor-pointer items-center justify-between gap-2 rounded p-2 text-sm transition-colors hover:bg-secondary-hover md:w-1/2 lg:w-1/3"
            onAction={() => onDeleteFile(item.id)}
          >
            <div className="flex w-1/3 flex-1 gap-x-2">
              <span className="truncate">{item.file.name}</span>
            </div>
            <Icon className="text-warning" name="trash" size="xs" />
          </ListBoxItem>
        )}
      </ListBox>
    </>
  );
}
