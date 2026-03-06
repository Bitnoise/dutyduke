import { type AbsenceStatus as PrismaAbsenceStatus, type AbsenceType } from '@/api/hris/prisma/client';
import {
  type Nullable,
  type CUID,
  type Prettify,
  type Paginated,
  type WithAccess,
  type ActionType,
} from '@/shared';

export type AbsenceStatus = PrismaAbsenceStatus;

export type AbsenceDTO = {
  id: CUID;
  type: AbsenceType;
  startDate: Date;
  endDate: Date;
  days: number;
  description: Nullable<string>;
  status: AbsenceStatus;
  label: Nullable<string>;
  issuerId: CUID;
  reviewerId: Nullable<CUID>;
  requestedAt: Date;
  approvedAt: Nullable<Date>;
  rejectedAt: Nullable<Date>;
  halfStart: boolean;
  halfEnd: boolean;
  recipientIds: string[];
};

export type RequestAbsenceDTO = Prettify<
  Pick<AbsenceDTO, 'type' | 'startDate' | 'endDate' | 'description' | 'issuerId'>
> & {
  reviewerId?: Nullable<CUID>;
  label?: Nullable<string>;
  status?: AbsenceStatus;
};

export type AbsenceAction = Extract<
  ActionType,
  'create' | 'select' | 'approve' | 'reject' | 'filter' | 'delete'
>;

export type AbsenceListDto = WithAccess<
  Paginated<AbsenceDTO>,
  {
    actions: AbsenceAction[];
  }
>;

export type AbsenceEventsDTO = {
  global: AbsenceDTO[];
  employees: AbsenceDTO[];
};
