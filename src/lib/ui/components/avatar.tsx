'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@/lib/ui';
import { API_ROUTES, cn, type Nullable } from '@/shared';

type AvatarSize = 'xs' | 'sm' | 'lg';

type Props = {
  size?: AvatarSize;
  avatarId: Nullable<string | null>;
};

const avatarSizes: Record<AvatarSize, number> = {
  xs: 18,
  sm: 24,
  lg: 46,
};

export function Avatar({ avatarId, size = 'lg' }: Props) {
  const [hasError, setHasError] = useState(false);
  const sizePx = avatarSizes[size];

  if (!avatarId || hasError) {
    return <Icon name="profile-circle" size={sizePx} />;
  }

  return (
    <Image
      alt="avatar"
      className={cn('rounded-full object-cover shrink-0', {
        'size-16 sm:size-[2.875rem]': size === 'lg',
        'size-6': size === 'sm',
        'size-4': size === 'xs',
      })}
      height={sizePx}
      src={API_ROUTES.photos(avatarId)}
      width={sizePx}
      onError={() => setHasError(true)}
    />
  );
}
