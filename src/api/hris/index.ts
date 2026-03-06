import { type OrganizationPrismaClient, prisma } from '@/api/hris/prisma/client';
import { employeesApi } from '@/api/hris/employees';
import { authApi } from '@/api/hris/authentication';
import { resourcesApi } from '@/api/hris/resources';
import { documentsApi } from '@/api/hris/documents';
import { type CUID } from '@/shared';
import { settingsApi } from '@/api/hris/settings';
import { companyApi } from '@/api/hris/company';
import { absencesApi } from './absences';
import { feedbackApi } from './feedback';
import { benefitsApi } from './benefits';
import { authorizationApi } from './authorization/api';

export type OrganizationContext = {
  organizationId: CUID;
  db: OrganizationPrismaClient;
};

// Default organization ID - will be set during app initialization/seeding
const DEFAULT_ORGANIZATION_ID = 'default-org-id';

// Create organization context with singleton Prisma client
function createOrganizationContext(): OrganizationContext {
  return {
    organizationId: DEFAULT_ORGANIZATION_ID,
    db: prisma as OrganizationPrismaClient,
  };
}

// Static HRIS API instance
export function instantiateHrisApi(organizationContext: OrganizationContext) {
  return {
    auth: authApi(organizationContext),
    employees: employeesApi(organizationContext),
    resources: resourcesApi(organizationContext),
    documents: documentsApi(organizationContext),
    settings: settingsApi(organizationContext),
    company: companyApi(organizationContext),
    absences: absencesApi(organizationContext),
    feedback: feedbackApi(organizationContext),
    benefits: benefitsApi(organizationContext),
    authorization: authorizationApi(organizationContext),
  };
}

// Lazy-initialized singleton to prevent build-time env access
let _hrisApi: ReturnType<typeof instantiateHrisApi> | null = null;

function getHrisApiInstance() {
  if (!_hrisApi) {
    _hrisApi = instantiateHrisApi(createOrganizationContext());
  }
  return _hrisApi;
}

// Export as getter to ensure lazy initialization at runtime, not build time
export const hrisApi = new Proxy({} as ReturnType<typeof instantiateHrisApi>, {
  get(_target, prop) {
    return getHrisApiInstance()[prop as keyof ReturnType<typeof instantiateHrisApi>];
  },
});

// Export getter function for consistency
export function getHrisApi() {
  return getHrisApiInstance();
}

export type Api = ReturnType<typeof instantiateHrisApi>;
