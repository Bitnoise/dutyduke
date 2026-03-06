'use client';

import { useState } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { Button } from '@/lib/ui/components';
import { cn } from '@/shared';
import { Navbar } from '@/lib/ui/components/navigation/navbar';
import { type MeDto } from '@/api/hris/authentication/model/dtos/employee.dto';
import { type SerializedPermissions } from '@/api/hris/authorization/client';

type Props = {
  account: MeDto;
  permissions: SerializedPermissions;
};

export function MainNavigation({ account, permissions }: Props): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true);
  const tNext = useNextTranslations('navigation');
  return (
    <aside
      className={cn(
        'hidden sticky top-14 min-h-[calc(100vh_-_3.5rem)] left-0 md:block size-full shrink-0 basis-14 bg-white transition-[flex_basis]',
        {
          'basis-52': isExpanded,
        },
      )}
    >
      <Navbar account={account} isExpanded={isExpanded} permissions={permissions} />
      <Button
        aria-label={isExpanded ? tNext('fold') : tNext('expand')}
        className={cn('absolute bottom-3.5 right-4 text-accent transition-transform rotate-180', {
          'rotate-0': isExpanded,
        })}
        icon="arrow-left"
        intent="ghost"
        onClick={() => setIsExpanded((prev) => !prev)}
      />
    </aside>
  );
}
