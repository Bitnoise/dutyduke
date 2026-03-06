import { getTranslations } from '@/shared/service/locale/get-translations';
import { Avatar, Button, Icon } from '@/lib/ui/components';
import { Menu, MenuItem } from '@/lib/ui/components/menu';
import { logout } from '@/shared/utils';
import { HRIS_ROUTES } from '@/shared';
import { type Api } from '@/api/hris';

export async function AccountMenu({ api }: { api: Api }): Promise<JSX.Element> {
  const t = await getTranslations();
  const me = await api.auth.getMe();

  const fullName = `${me.firstName} ${me.lastName}`;

  return (
    <Menu
      className="flex flex-col gap-1"
      trigger={
        <Button intent="ghost">
          <div className="flex items-center">
            <div className="md:pr-1.5">
              <Avatar key={me.avatarId} avatarId={me.avatarId} size="sm" />
            </div>
            <span className="hidden text-sm md:block">{fullName}</span>
            <Icon className="hidden md:inline-block" name="arrow2-down" size="xs" />
          </div>
        </Button>
      }
    >
      <MenuItem className="flex w-36 items-center gap-x-2" href={HRIS_ROUTES.employees.general.base(me.id)}>
        <Icon name="personal-card" size="xs" />
        <span>{t('navigation.myProfile')}</span>
      </MenuItem>
      <MenuItem className="flex w-36 items-center gap-x-2" href={HRIS_ROUTES.settings.general}>
        <Icon name="settings" size="xs" />
        <span>{t('navigation.settings')}</span>
      </MenuItem>
      <MenuItem className="flex w-36 items-center gap-x-2 text-warning" onAction={logout}>
        <Icon name="offboarding" size="xs" />
        <span>{t('ctaLabels.logout')}</span>
      </MenuItem>
    </Menu>
  );
}
