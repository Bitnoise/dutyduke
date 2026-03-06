import { SEARCH_PARAM_KEYS } from '@/shared/constants/search-param-keys';
import { type CUID } from '@/shared/types';

export const AUTH_ROUTES = {
  signUp: '/sign-up',
  signIn: '/sign-in',
  forgotPassword: '/forgot-password',
  changePassword: (employeeId: CUID) => `/change-password/${employeeId}`,
  resetPassword: (token: string) => `/forgot-password/${token}`,
};

export const ICAL_ROUTES = {
  absences: '/api/calendar/absences',
};

export const HRIS_ROUTES = {
  dashboard: '/dashboard',
  employees: {
    base: `/employees?filter=${encodeURIComponent('ACTIVE')}`,
    create: '/employees/create',
    general: {
      base: (employeeId: string) => `/employees/${employeeId}/general`,
    },
    dictionaries: {
      base: (name: string) => `/employees/dictionaries/${name}`,
    },
    absence: {
      base: (employeeId: string) => `/employees/${employeeId}/absence?year=${new Date().getFullYear()}`,
      request: (employeeId: string) => `/employees/${employeeId}/absence/request`,
    },
    earnings: {
      base: (employeeId: string) => `/employees/${employeeId}/earnings`,
      edit: (employeeId: string, earningId: string) => `/employees/${employeeId}/earnings/${earningId}/edit`,
      delete: (employeeId: string, earningId: string) =>
        `/employees/${employeeId}/earnings/${earningId}/delete`,
      update: (employeeId: string) => `/employees/${employeeId}/earnings/update`,
    },
    skills: {
      base: (employeeId: string) => `/employees/${employeeId}/skills`,
    },
    documents: {
      base: (employeeId: string) => `/employees/${employeeId}/documents`,
      edit: (employeeId: CUID, documentId: CUID) => `/employees/${employeeId}/documents/${documentId}/edit`,
    },
    equipment: {
      base: (employeeId: CUID) => `/employees/${employeeId}/equipment?category=ALL&status=WORKING`,
      assign: (employeeId: CUID) => `/employees/${employeeId}/equipment/assign?category=ALL&status=WORKING`,
      unassign: (
        employeeId: CUID,
        equipmentIds?: string,
        category?: string,
        status?: string,
        filter?: string,
      ) =>
        `/employees/${employeeId}/equipment/unassign?equipment=${encodeURIComponent(equipmentIds ?? '')}&category=${encodeURIComponent(category ?? '')}&status=${encodeURIComponent(status ?? '')}&filter=${encodeURIComponent(filter ?? '')}`,
    },
    feedback: {
      base: (employeeId: string) => `/employees/${employeeId}/feedback`,
      schedule: (employeeId: string) => `/employees/${employeeId}/feedback/schedule`,
      edit: (employeeId: string, feedbackId: string) =>
        `/employees/${employeeId}/feedback/${feedbackId}/edit`,
    },
    benefits: {
      base: (employeeId: CUID) => `/employees/${employeeId}/benefits`,
    },
  },
  company: {
    base: '/company',
    general: '/company/general',
    equipment: {
      dictionaries: {
        base: (name: string) => `/company/equipment/dictionaries/${name}`,
      },
    },
    absences: {
      base: `/company/absences?status=${encodeURIComponent('APPROVED,PENDING,REJECTED')}&type=${encodeURIComponent('HOLIDAY,SICK,PERSONAL')}`,
      request: `/company/absences/request`,
      availability: `/company/absences/availability`,
      ical: `/company/absences/ical`,
      settings: {
        base: `/company/absences/settings`,
        add: `/company/absences/settings/add`,
      },
    },
  },
  equipment: {
    base: `/company/equipment?category=ALL&status=WORKING&filter=${encodeURIComponent('ASSIGNED,FREE')}`,
    create: '/company/equipment/create',
    duplicate: (equipmentId: CUID) => `/company/equipment/${equipmentId}/duplicate`,
    general: (equipmentId: CUID) => `/company/equipment/${equipmentId}/general`,
    changelog: {
      base: (equipmentId: CUID) => `/company/equipment/${equipmentId}/changelog`,
    },
    documents: {
      base: (equipmentId: CUID) => `/company/equipment/${equipmentId}/documents`,
      edit: (equipmentId: CUID, documentId: CUID) =>
        `/company/equipment/${equipmentId}/documents/${documentId}/edit`,
    },
    assignEmployee: (equipmentIds: string, category?: string, status?: string, filter?: string) =>
      `/company/equipment/assign-employee?${SEARCH_PARAM_KEYS.EQUIPMENT}=${encodeURIComponent(equipmentIds)}&eqStatus=${encodeURIComponent(status ?? '')}&eqCategory=${encodeURIComponent(category ?? '')}&eqFilter=${encodeURIComponent(filter ?? '')}`,
    assign: (equipmentIds: string, category?: string, status?: string, filter?: string) =>
      `/company/equipment/assign?${SEARCH_PARAM_KEYS.EQUIPMENT}=${encodeURIComponent(equipmentIds)}&eqStatus=${encodeURIComponent(status ?? '')}&eqCategory=${encodeURIComponent(category ?? '')}&eqFilter=${encodeURIComponent(filter ?? '')}`,
    unassignEmployee: (equipmentIds: string, category?: string, status?: string, filter?: string) =>
      `/company/equipment/unassign-employee?${SEARCH_PARAM_KEYS.EQUIPMENT}=${encodeURIComponent(equipmentIds)}&status=${encodeURIComponent(status ?? '')}&category=${encodeURIComponent(category ?? '')}&filter=${encodeURIComponent(filter ?? '')}`,
    update: (equipmentIds: string, category?: string, status?: string, filter?: string) =>
      `/company/equipment/update?${SEARCH_PARAM_KEYS.EQUIPMENT}=${encodeURIComponent(equipmentIds)}&status=${encodeURIComponent(status ?? '')}&category=${encodeURIComponent(category ?? '')}&filter=${encodeURIComponent(filter ?? '')}`,
    archive: (equipmentIds: string, category?: string, status?: string, filter?: string) =>
      `/company/equipment/archive?${SEARCH_PARAM_KEYS.EQUIPMENT}=${encodeURIComponent(equipmentIds)}&status=${encodeURIComponent(status ?? '')}&category=${encodeURIComponent(category ?? '')}&filter=${encodeURIComponent(filter ?? '')}`,
  },
  documents: {
    base: `/company/documents?category=ALL&filter=${encodeURIComponent('ASSIGNED,FREE')}&status=${encodeURIComponent('ACTIVE,EXPIRING_SOON,EXPIRED')}`,
    add: `/company/documents/add`,
    edit: (documentIds: string, category?: string, status?: string, filter?: string) =>
      `/company/documents/edit?${SEARCH_PARAM_KEYS.DOCUMENTS}=${encodeURIComponent(documentIds)}&status=${encodeURIComponent(status ?? '')}&category=${encodeURIComponent(category ?? '')}&filter=${encodeURIComponent(filter ?? '')}`,
    delete: (documentIds: string, category?: string, status?: string, filter?: string) =>
      `/company/documents/delete?${SEARCH_PARAM_KEYS.DOCUMENTS}=${encodeURIComponent(documentIds)}&status=${encodeURIComponent(status ?? '')}&category=${encodeURIComponent(category ?? '')}&filter=${encodeURIComponent(filter ?? '')}`,
    categories: '/company/documents/categories',
  },
  benefits: {
    base: '/company/benefits',
    create: '/company/benefits/create',
    edit: (benefitId: CUID) => `/company/benefits/${benefitId}/edit`,
    assign: (benefitIds: string) =>
      `/company/benefits/assign?${SEARCH_PARAM_KEYS.BENEFIT}=${encodeURIComponent(benefitIds)}`,
  },
  settings: {
    base: '/settings',
    general: '/settings/general',
    changePassword: '/settings/change-password',
    roles: '/settings/roles',
    danger: '/settings/danger',
  },
};

export const API_ROUTES = {
  downloadCv: (employeeIds: string[] | 'all', param: 0 | 1 = 1) =>
    `/api/download-cv?employees=${employeeIds === 'all' ? 'all' : employeeIds.join(',')}&anonymize=${param}`,
  documents: {
    open: (documentId: CUID) => `/api/documents/${documentId}`,
  },
  photos: (photoId: CUID, param: 0 | 1 = 0, dir: 'employee' | 'company' = 'employee') =>
    `/api/photos/${encodeURIComponent(photoId)}?download=${param}&dir=${dir}`,
  company: {
    photos: {
      view: (photoId: CUID) => `/api/company/photos/${photoId}?download=0`,
      download: (photoId: CUID) => `/api/company/photos/${photoId}?download=1`,
    },
  },
  equipment: {
    photos: {
      view: (photoId: CUID) => `/api/equipment/photos/${photoId}?download=0`,
      download: (photoId: CUID) => `/api/equipment/photos/${photoId}?download=1`,
    },
  },
};

export const ACCESS_ROUTES: Record<'OWNER' | 'EMPLOYEE', string[]> = {
  OWNER: [
    'dashboard',
    'employees.base',
    'employees.create',
    'employees.general.base',
    'employees.earnings.base',
    'employees.earnings.update',
    'employees.earnings.delete',
    'employees.earnings.edit',
    'employees.skills.base',
    'employees.documents.base',
    'employees.documents.edit',
    'employees.absence.base',
    'employees.absence.request',
    'company.base',
    'company.general',
    'settings.base',
    'settings.general',
    'settings.changePassword',
    'settings.danger',
    'company.equipment.base',
    'company.equipment.create',
    'company.equipment.duplicate',
    'company.equipment.general',
    'company.equipment.assign',
    'company.equipment.unassign',
    'company.documents.base',
    'company.documents.edit',
    'company.documents.delete',
    'equipment.documents.edit',
    'company.equipment.dictionaries',
    'company.absences.base',
    'company.absences.availability',
    'company.absences.request',
    'company.absences.settings',
    'company.benefits.base',
    'company.benefits.create',
    'company.benefits.edit',
  ],
  EMPLOYEE: [
    'dashboard',
    'employees.base',
    'employees.general.base',
    'employees.earnings.base',
    'employees.skills.base',
    'employees.documents.base',
    'employees.absences.base',
    'employees.absences.request',
    'company.base',
    'company.general',
    'company.absences.base',
    'company.absences.request',
    'settings.base',
    'settings.general',
    'settings.changePassword',
  ],
};

export function hasAccess(accessRoles: string[] | Array<{ key: string }>, path: string): boolean {
  const routes: string[] = [];

  for (const accessRole of accessRoles) {
    // Handle RoleDefinition objects (new format)
    const roleKey = typeof accessRole === 'object' && 'key' in accessRole ? accessRole.key : accessRole;

    // Map role key to access role type
    let accessRoleKey: 'OWNER' | 'EMPLOYEE';
    if (roleKey === 'OWNER') {
      accessRoleKey = 'OWNER';
    } else if (roleKey === 'EMPLOYEE') {
      accessRoleKey = 'EMPLOYEE';
    } else {
      // Unknown role, skip it
      continue;
    }

    const roleRoutes = ACCESS_ROUTES[accessRoleKey];
    if (roleRoutes) {
      routes.push(...roleRoutes);
    }
  }

  const routesWithoutDuplicates = new Set(routes);

  return routesWithoutDuplicates.has(path);
}
