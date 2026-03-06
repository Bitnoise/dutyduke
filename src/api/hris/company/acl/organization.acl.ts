export function organizationAcl() {
  const getOrganizationName = async () => {
    // Single organization - return default name
    // TODO: Get organization name from environment or configuration
    return process.env.NEXT_PUBLIC_ORGANIZATION_NAME || 'DutyDuke';
  };

  return {
    getOrganizationName,
  };
}
