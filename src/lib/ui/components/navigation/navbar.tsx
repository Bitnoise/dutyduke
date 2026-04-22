'use client';
import Link from 'next/link';
import { Fragment } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { cn, HRIS_ROUTES, navigationLinks } from '@/shared';
import { Icon } from '@/lib/ui';
import { type IconNames } from '@/lib/ui/icons';
import { type MeDto } from '@/api/hris/authentication/model/dtos/employee.dto';
import { type SerializedPermissions, canAccess } from '@/api/hris/authorization/client';

type Props = React.ComponentProps<'nav'> & {
  isExpanded: boolean;
  account: MeDto;
  permissions: SerializedPermissions;
  onLinkClick?: () => void;
};

type NavItemProps = {
  href: string;
  icon: IconNames;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  // 'primary' items (Dashboard, My profile) render taller than segment links.
  variant: 'primary' | 'segment';
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

function NavItem({ href, icon, label, isActive, isExpanded, variant, onClick }: NavItemProps): JSX.Element {
  return (
    <Link
      aria-label={label}
      className={cn(
        'relative flex items-center gap-x-2 rounded-lg px-2.5 text-sm font-semibold transition-colors hover:bg-hover',
        variant === 'primary' ? 'py-3.5' : 'h-10',
        { 'bg-hover': isActive },
      )}
      href={href}
      title={label}
      onClick={onClick}
    >
      <Icon className="text-accent" name={icon} />
      <span
        className={cn('block max-h-6 sr-only opacity-0 transition-opacity delay-75 break-all', {
          'not-sr-only opacity-100': isExpanded,
        })}
      >
        {label}
      </span>
    </Link>
  );
}

export function Navbar({ isExpanded, account, permissions, onLinkClick, ...other }: Props): JSX.Element {
  const tNext = useNextTranslations('navigation');
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();

    onLinkClick?.();
    router.push(event.currentTarget.href);
  };

  const myProfileHref = HRIS_ROUTES.employees.general.base(account.id);

  return (
    <nav className="navigation-menu pt-[2.375rem]" {...other}>
      <ul>
        <li className="my-2 px-1.5">
          <NavItem
            href={HRIS_ROUTES.dashboard}
            icon="dashboard"
            isActive={pathname === HRIS_ROUTES.dashboard}
            isExpanded={isExpanded}
            label={tNext('dashboard')}
            variant="primary"
            onClick={handleLinkClick}
          />
        </li>
        {/* pb-6 separates the personal items (Dashboard, My profile) from the first segment group. */}
        <li className="px-1.5 pb-6">
          <NavItem
            href={myProfileHref}
            icon="personal-card"
            isActive={pathname === myProfileHref}
            isExpanded={isExpanded}
            label={tNext('myProfile')}
            variant="primary"
            onClick={handleLinkClick}
          />
        </li>
        {Object.entries(navigationLinks).map(([segment, links]) => {
          const visibleLinks = links.filter(
            (link) => !link._access || canAccess(permissions, link._access.resource, link._access.action),
          );

          if (visibleLinks.length === 0) {
            return null;
          }

          return (
            <Fragment key={segment}>
              <li
                className={cn(
                  'pl-12 text-[0.625rem] mt-8 text-text-helper transition-opacity delay-75 break-all sr-only opacity-0 h-3.5 ',
                  {
                    'opacity-100 not-sr-only': isExpanded,
                  },
                )}
              >
                {tNext(segment).toUpperCase()}
              </li>
              {visibleLinks.map((link) => (
                <li key={link.label} className="my-2 px-1.5">
                  <NavItem
                    href={link.href}
                    icon={link.icon}
                    isActive={link.href.includes(pathname)}
                    isExpanded={isExpanded}
                    label={tNext(link.label)}
                    variant="segment"
                    onClick={handleLinkClick}
                  />
                </li>
              ))}
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
}
