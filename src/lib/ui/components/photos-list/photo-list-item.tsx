import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { API_ROUTES, cn, type CUID, type PropsWithClassName } from '@/shared';
import { Button } from '@/lib/ui';
import { type PhotoListItemAction } from './types';

type Props = {
  actions: PhotoListItemAction[];
  id: CUID;
  alt?: string;
  src: string | File;
  isAvatar?: boolean;
  isEditable?: boolean;
  onDelete?: (id: CUID) => void;
  onAvatarChange?: (id: CUID) => void;
  dir?: 'company' | 'employee';
};

export function PhotoListItem({
  actions,
  id,
  className,
  src,
  alt = 'photo list item',
  isAvatar = false,
  onAvatarChange,
  onDelete,
  dir = 'employee',
}: PropsWithClassName<Props>): JSX.Element {
  const tNext = useNextTranslations();
  const router = useRouter();

  const imageSrc = typeof src === 'string' ? API_ROUTES.photos(id, 0, dir) : URL.createObjectURL(src);

  return (
    <div className={cn('relative w-fit', className)}>
      {actions.includes('set-avatar') && (
        <Button
          aria-label={tNext('ctaLabels.setAsAvatar')}
          className="absolute right-1.5 top-1.5 max-h-6 max-w-6"
          icon="profile-circle"
          intent={isAvatar ? 'primary' : 'tertiary'}
          type="button"
          onClick={() => onAvatarChange?.(id)}
        />
      )}
      <Image alt={alt} className={'size-[88px] rounded object-cover'} height={88} src={imageSrc} width={88} />
      {actions.includes('delete') && (
        <Button
          aria-label={tNext('ctaLabels.deletePhoto')}
          className="absolute bottom-1.5 right-1.5 max-h-6 max-w-6"
          icon="trash"
          intent="tertiary"
          type="button"
          onClick={() => onDelete?.(id)}
        />
      )}
      {actions.includes('download') && (
        <Button
          aria-label={tNext('ctaLabels.deletePhoto')}
          className="absolute bottom-1.5 right-1.5 max-h-6 max-w-6"
          icon="document-download"
          intent="tertiary"
          type="button"
          onClick={() => router.push(API_ROUTES.photos(id, 1, dir))}
        />
      )}
    </div>
  );
}
