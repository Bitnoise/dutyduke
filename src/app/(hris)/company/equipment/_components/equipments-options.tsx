'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from '@/lib/ui';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { HRIS_ROUTES } from '@/shared';

export function EquipmentsOptions(): JSX.Element {
  const t = useTranslations('company.equipment');
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <BasicHeader>{t('title')}</BasicHeader>
      <Menu
        trigger={
          <Button icon="context" intent="tertiary" size="sm">
            {t('options.base')}
          </Button>
        }
      >
        <MenuItem
          className="flex items-center gap-x-2.5"
          onAction={() => router.push(HRIS_ROUTES.company.equipment.dictionaries.base('category'))}
        >
          <span>{t('options.dictionaries')}</span>
        </MenuItem>
      </Menu>
    </div>
  );
}
