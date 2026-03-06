export type AccessRoles = {
  key: string;
  label: string;
};

export const ACCESS_ROLES: AccessRoles[] = [
  {
    key: 'owner',
    label: 'roles.owner',
  },
  {
    key: 'hr',
    label: 'roles.employee',
  },
  {
    key: 'office',
    label: 'roles.office',
  },
  {
    key: 'employee',
    label: 'roles.employee',
  },
];
