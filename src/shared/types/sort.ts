export type SortDir = 'asc' | 'desc';
export type OrderByKey =
  | 'id'
  | 'name'
  | 'expDate'
  | 'firstName'
  | 'lastName'
  | 'createdAt'
  | 'workEmail'
  | 'email'
  | 'signature'
  | 'description'
  | 'requestedAt'
  | 'startDate'
  | 'endDate'
  | 'days'
  | 'status'
  | 'type'
  | 'note';

export type OrderBy = `${OrderByKey}-${SortDir}`;

export type SortParams = {
  orderBy: OrderByKey;
  sortDir: SortDir;
};

export type EmployeeListOrderBy = Extract<
  OrderBy,
  'firstName-asc' | 'firstName-desc' | 'lastName-asc' | 'lastName-desc' | 'workEmail-asc' | 'workEmail-desc'
>;

export type EquipmentOrderBy = Extract<OrderBy, 'signature-asc' | 'signature-desc'>;
export type BenefitOrderBy = Extract<OrderBy, 'name-asc' | 'name-desc' | 'createdAt-asc' | 'createdAt-desc'>;
export type DocumentsOrderBy = Extract<
  OrderBy,
  'description-asc' | 'description-desc' | 'expDate-asc' | 'expDate-desc' | 'createdAt-asc' | 'createdAt-desc'
>;
export type AbsenceListOrderBy = Extract<
  OrderBy,
  | 'requestedAt-asc'
  | 'requestedAt-desc'
  | 'startDate-asc'
  | 'startDate-desc'
  | 'endDate-asc'
  | 'endDate-desc'
  | 'days-asc'
  | 'days-desc'
>;
