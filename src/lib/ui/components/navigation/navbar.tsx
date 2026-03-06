'use client';
import Link from 'next/link';
import { Fragment } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { cn, HRIS_ROUTES, navigationLinks } from '@/shared';
import { Icon } from '@/lib/ui';
import { type MeDto } from '@/api/hris/authentication/model/dtos/employee.dto';
import { type SerializedPermissions, canAccess } from '@/api/hris/authorization/client';

type Props = React.ComponentProps<'nav'> & {
  isExpanded: boolean;
  account: MeDto;
  permissions: SerializedPermissions;
  onLinkClick?: () => void;
};

export function Navbar({
  isExpanded,
  account: _account,
  permissions,
  onLinkClick,
  ...other
}: Props): JSX.Element {
  const tNext = useNextTranslations('navigation');
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();

    onLinkClick?.();
    router.push(event.currentTarget.href);
  };

  return (
    <nav className="navigation-menu pt-[2.375rem]" {...other}>
      <ul>
        <li className="px-1.5 pb-6">
          <Link
            aria-label={tNext('dashboard')}
            className={cn(
              'relative flex items-center gap-x-2  rounded-lg  px-2.5 py-3.5 text-sm font-semibold transition-colors hover:bg-hover',
              {
                'bg-hover': pathname === HRIS_ROUTES.dashboard,
              },
            )}
            href={HRIS_ROUTES.dashboard}
            title={tNext('dashboard')}
            onClick={handleLinkClick}
          >
            <Icon className="text-accent" name="dashboard" />
            <span
              className={cn('block max-h-6 sr-only opacity-0 transition-opacity delay-75 break-all', {
                'not-sr-only opacity-100': isExpanded,
              })}
            >
              {tNext('dashboard')}
            </span>
          </Link>
        </li>
        {Object.entries(navigationLinks).map(([segment, links]) => {
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
              {links.map((link) => {
                // Check permission-based access using serialized permissions
                if (link._access) {
                  const hasPermission = canAccess(permissions, link._access.resource, link._access.action);
                  if (!hasPermission) {
                    return null;
                  }
                }

                return (
                  <li key={link.label} className={cn('px-1.5 my-2')}>
                    <Link
                      aria-label={tNext(link.label)}
                      className={cn(
                        'relative flex items-center gap-x-2 rounded-lg px-2.5 h-10 text-sm font-semibold transition-colors hover:bg-hover',
                        {
                          'bg-hover': link.href.includes(pathname),
                        },
                      )}
                      href={link.href}
                      title={tNext(link.label)}
                      onClick={handleLinkClick}
                    >
                      <Icon className="text-accent" name={link.icon} />
                      <span
                        className={cn(
                          'block max-h-6 sr-only opacity-0 transition-opacity delay-75 break-all',
                          {
                            'not-sr-only opacity-100': isExpanded,
                          },
                        )}
                      >
                        {tNext(link.label)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
}
