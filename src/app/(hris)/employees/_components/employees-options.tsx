'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from '@/lib/ui';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { HRIS_ROUTES } from '@/shared';

export function EmployeesOptions(): JSX.Element {
  const t = useTranslations('');
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <BasicHeader>{t('navigation.employeesList')}</BasicHeader>
      <Menu
        trigger={
          <Button icon="context" intent="tertiary" size="sm">
            {t('employees.navigation.options')}
          </Button>
        }
      >
        <MenuItem
          className="flex items-center gap-x-2.5"
          onAction={() => router.push(HRIS_ROUTES.employees.dictionaries.base('skills'))}
        >
          <span>{t('employees.navigation.dictionaries')}</span>
        </MenuItem>
      </Menu>
    </div>
  );
}
