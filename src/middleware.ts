import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { getRedirectUrl, getUnauthenticatedRedirectUrl } from '@/shared/utils/redirect';
import { PermissionAction, ResourceType } from '@/api/hris/authorization/permissions';
import { AUTH_ROUTES, HRIS_ROUTES, ICAL_ROUTES } from './shared/constants/routes';

// Route to permission mapping (match base paths)
const ROUTE_PERMISSIONS: Array<{
  path: string;
  resource: ResourceType;
  action: PermissionAction;
  ownerOnly?: boolean;
}> = [
  {
    path: '/employees',
    resource: ResourceType.EMPLOYEES,
    action: PermissionAction.VIEW,
  },
  {
    path: '/company/absences',
    resource: ResourceType.COMPANY_ABSENCES,
    action: PermissionAction.VIEW,
  },
  {
    path: '/company/equipment',
    resource: ResourceType.COMPANY_EQUIPMENT,
    action: PermissionAction.VIEW,
  },
  {
    path: '/company/documents',
    resource: ResourceType.COMPANY_DOCUMENTS,
    action: PermissionAction.VIEW,
  },
  {
    path: '/company/benefits',
    resource: ResourceType.COMPANY_BENEFITS,
    action: PermissionAction.VIEW,
  },
  {
    path: '/company/general',
    resource: ResourceType.COMPANY_SETTINGS,
    action: PermissionAction.VIEW,
  },
  {
    path: '/settings/danger',
    resource: ResourceType.COMPANY_SETTINGS,
    action: PermissionAction.DELETE,
    ownerOnly: true, // Extra protection for destructive actions
  },
];

export async function middleware(request: NextRequest) {
  // INFO: skip Server Actions - return NextResponse.redirect is not working for them, they are authorized with authorization.ts
  if (request.headers.get('next-action')) {
    return;
  }

  if (isPublicRoute(request.url)) {
    return;
  }

  const accessToken = (await cookies()).get('Authorization');
  if (!accessToken?.value) {
    return NextResponse.redirect(await getUnauthenticatedRedirectUrl(AUTH_ROUTES.signIn));
  }

  // Support both old (enum) and new (key) formats
  const me = jwtDecode(accessToken.value) as {
    payload: { roles: string[] };
  };
  const userRoles = me.payload.roles;

  // Check if user has OWNER role
  const hasOwnerRole = userRoles.includes('OWNER');

  // Check owner-only routes
  if (isOwnerOnlyRoute(request.url) && !hasOwnerRole) {
    return NextResponse.redirect(await getRedirectUrl(HRIS_ROUTES.employees.base));
  }

  // Check route permissions (basic check - full permission checking happens in controllers)
  const pathname = new URL(request.url).pathname;
  const routePermission = ROUTE_PERMISSIONS.find((rp) => pathname.startsWith(rp.path));

  if (routePermission) {
    // Extra protection for owner-only routes
    if (routePermission.ownerOnly && !hasOwnerRole) {
      return NextResponse.redirect(await getRedirectUrl(HRIS_ROUTES.employees.base));
    }

    // For now, we only check owner role in middleware
    // Full permission checking with scope happens in controllers via permission checker
    // This is a basic gate - detailed checks are in the authorization layer
  }
}

const isPublicRoute = (url: string) => PUBLIC_ROUTES.some((publicRoute) => url.includes(publicRoute));
const isOwnerOnlyRoute = (url: string) => OWNER_ONLY_ROUTES.some((ownerRoute) => url.includes(ownerRoute));

const PUBLIC_ROUTES = [AUTH_ROUTES.signIn, AUTH_ROUTES.signUp, ICAL_ROUTES.absences];
const OWNER_ONLY_ROUTES = [HRIS_ROUTES.settings.danger];

export const config = {
  matcher: [
    '/dashboard',
    '/sign-in',
    '/sign-up',
    '/employees/:path*',
    '/settings/:path*',
    '/company/:path*',
    '/api/calendar/absences/:path*',
  ],
};
