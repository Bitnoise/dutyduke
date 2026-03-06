'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from '@/lib/ui';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { HRIS_ROUTES } from '@/shared';

type Props = {
  variant?: 'default' | 'small';
};

export function DocumentsItemMenu({ variant = 'default' }: Props): JSX.Element {
  const t = useTranslations('company.documents');
  const tNext = useNextTranslations('company.documents');
  return (
    <Menu
      aria-label={tNext('menuCategories')}
      trigger={
        variant === 'default' ? (
          <>
            <Button className="hidden lg:block" icon="context" intent="tertiary" size="sm">
              {t('options')}
            </Button>
            <Button className="lg:hidden" icon="context" intent="ghost" size="sm" />
          </>
        ) : undefined
      }
    >
      <MenuItem
        className="flex items-center gap-x-2.5"
        href={HRIS_ROUTES.documents.categories}
        textValue={tNext('menuCategories')}
      >
        <span>{t('menuCategories')}</span>
      </MenuItem>
    </Menu>
  );
}
