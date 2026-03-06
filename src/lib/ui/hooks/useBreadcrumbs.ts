import { HRIS_ROUTES } from '@/shared';
// Match CUIDs - starts with 'c' followed by alphanumeric characters (typically 18-24 chars after c)
const ID_REGEX = new RegExp(/^c[a-z0-9]{18,25}$/);

export type Breadcrumb = {
  href: string;
  label: string;
};

const BASE_BREADCRUMBS = [
  'dashboard',
  'company',
  'employees',
  'employees.absence',
  'employees.feedback',
  'earnings',
  'equipment',
  'documents',
  'settings',
  'dictionaries',
  'absences',
  'feedback',
  'benefits',
];

/**
 * Hook that generates breadcrumb navigation items based on the current URL path.
 *
 * @returns array of items with `Breadcrumb` type.
 */
export function useBreadcrumbs(pathName: string) {
  const breadcrumbs: Breadcrumb[] = [];

  const pathnameArr = pathName.split('/').filter(Boolean);

  let composedPathname = '';

  for (let index = 0; index < pathnameArr.length; index++) {
    const pathSegment = pathnameArr[index]!;
    composedPathname += `/${pathSegment}`;

    // Treat dynamic segments as non-translatable:
    // 1) CUID-like IDs
    // 2) The segment directly after "employees" (slug / human‑readable id)
    // 3) The segment directly after "equipment" (equipmentId)
    const isEmployeesIdSegment = index > 0 && pathnameArr[index - 1] === 'employees';
    const isEquipmentIdSegment = index > 0 && pathnameArr[index - 1] === 'equipment';
    if (ID_REGEX.test(pathSegment) || isEmployeesIdSegment || isEquipmentIdSegment) {
      continue;
    }

    const isBaseRoute = BASE_BREADCRUMBS.some((route) => {
      return route.startsWith(pathSegment);
    });

    const hrisRoute =
      isBaseRoute && typeof HRIS_ROUTES[`${pathSegment}` as keyof typeof HRIS_ROUTES] === 'object'
        ? HRIS_ROUTES[`${pathSegment}` as keyof typeof HRIS_ROUTES]
        : composedPathname;

    const segmentsForLabel = composedPathname.split('/').filter((segment, segIndex, segments) => {
      if (!segment) return false;
      if (ID_REGEX.test(segment)) return false;

      // Also strip dynamic ids from deeper paths like /employees/[id]/general or /equipment/[id]/general
      if (segIndex > 0 && segments[segIndex - 1] === 'employees') return false;
      if (segIndex > 0 && segments[segIndex - 1] === 'equipment') return false;

      return true;
    });

    const labelBase = segmentsForLabel.join('.');

    breadcrumbs.push({
      href: typeof hrisRoute === 'object' ? hrisRoute.base : hrisRoute,
      label: 'breadcrumbs.' + labelBase + (isBaseRoute ? '.base' : ''),
    });
  }

  return breadcrumbs;
}
