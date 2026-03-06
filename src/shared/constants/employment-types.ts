export const EMPLOYMENT_TYPES = [
  {
    key: 'EMPLOYMENT_CONTRACT',
    label: 'employmentTypes.employmentContract',
  },
  {
    key: 'WORK_CONTRACT',
    label: 'employmentTypes.workContract',
  },
  {
    key: 'COMMISSION_CONTRACT',
    label: 'employmentTypes.commissionContract',
  },
  {
    key: 'B2B_CONTRACT',
    label: 'employmentTypes.b2bContract',
  },
  {
    key: 'AGENCY_CONTRACT',
    label: 'employmentTypes.agencyContract',
  },
  {
    key: 'OTHER',
    label: 'employmentTypes.other',
  },
];

export const EMPLOYMENT_TYPES_KEYS = [
  'EMPLOYMENT_CONTRACT',
  'WORK_CONTRACT',
  'COMMISSION_CONTRACT',
  'B2B_CONTRACT',
  'AGENCY_CONTRACT',
  'OTHER',
] as const;

export const parseEmploymentTypeToLabel = (key: (typeof EMPLOYMENT_TYPES_KEYS)[number]) => {
  return EMPLOYMENT_TYPES.find((employmentType) => employmentType.key === key)!.label;
};
