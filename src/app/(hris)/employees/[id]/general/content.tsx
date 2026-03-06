import { type CUID } from '@/shared';
import { hrisApi } from '@/api/hris';
import {
  ApplicationAccessForm,
  BasicInfoForm,
  ContactForm,
  OtherForm,
  PartnershipForm,
} from '@/app/(hris)/employees/[id]/general/_forms';
import { type Photo } from '@/lib/ui/components/photos-list/types';
import { getPermissionChecker } from '@/api/hris/authorization';
import { API_ROUTES } from '@/shared/constants/routes';

type Props = {
  id: CUID;
};

export default async function EmployeeGeneralContent({ id }: Props): Promise<JSX.Element> {
  const api = hrisApi;

  const [employee, companyName, me, checker] = await Promise.all([
    api.employees.getEmployeeGeneralInfo(id),
    api.employees.getEmployeeOrganizationName(),
    api.auth.getMe(),
    getPermissionChecker(),
  ]);

  // Map photosIds directly to Photo objects - photos are stored as file paths, not documents
  const photos: Photo[] = employee.photosIds.map((photoId) => ({
    id: photoId,
    filePath: API_ROUTES.photos(photoId, 0, 'employee'),
    isAvatar: photoId === employee.avatarId,
  }));

  const isArchived = employee.status === 'ARCHIVED';
  const canManageRoles = checker.isOwner();

  // Get roles data if user can manage roles
  let allRoles: Awaited<ReturnType<typeof api.authorization.roles.getAllRoles>> = [];
  let assignedRoles: Awaited<ReturnType<typeof api.authorization.roles.getRolesForIdentity>> = [];

  if (canManageRoles) {
    allRoles = await api.authorization.roles.getAllRoles();
    if (employee.identityId) {
      assignedRoles = await api.authorization.roles.getRolesForIdentity(employee.identityId);
    }
  }

  // Get identity info if exists
  let identityInfo: { email: string; roles: string[] } | null = null;
  if (canManageRoles && employee.identityId) {
    const identity = await api.auth.getIdentityById(employee.identityId);
    if (identity) {
      identityInfo = identity;
    }
  }

  // Extract role keys from assignedRoles for display (more reliable than identityInfo.roles)
  const identityRoleKeys =
    assignedRoles.length > 0 ? assignedRoles.map((r) => r.key) : identityInfo?.roles || [];

  return (
    <div className="flex flex-col gap-y-12">
      <BasicInfoForm
        basicInfo={employee}
        dateFormat={me.dateFormat}
        employeeId={id}
        isDisabled={isArchived}
      />
      {canManageRoles && (
        <ApplicationAccessForm
          assignedRoles={assignedRoles}
          availableRoles={allRoles}
          employeeEmail={employee.workEmail}
          employeeId={id}
          identityEmail={identityInfo?.email || null}
          identityId={employee.identityId}
          identityRoles={identityRoleKeys}
          isDisabled={isArchived}
        />
      )}
      <PartnershipForm
        company={companyName}
        employeeId={id}
        isDisabled={isArchived}
        partnershipInfo={employee}
      />
      <ContactForm contactInfo={employee} employeeId={id} isDisabled={isArchived} />
      <OtherForm
        dateFormat={me.dateFormat}
        employeeId={id}
        isDisabled={isArchived}
        otherInfo={employee}
        photos={photos}
      />
    </div>
  );
}
