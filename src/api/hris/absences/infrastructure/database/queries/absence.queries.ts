import {
  AbsenceStatus,
  type OrganizationPrismaClient,
  type OrganizationPrisma,
  type AbsenceType,
} from '@/api/hris/prisma/client';
import { type CUID } from '@/api/hris/types';
import {
  getPaginatedData,
  ITEMS_PER_PAGE,
  type Paginated,
  parseSort,
  type AbsenceListOrderBy,
  countTakenDaysOff,
} from '@/shared';
import { type AbsenceDTO } from '../../../model/dtos/absence.dto';

export function absenceQueries(db: OrganizationPrismaClient) {
  const getAllAbsences = async (
    page: number,
    startDate?: Date,
    endDate?: Date,
    statusFilter?: AbsenceStatus[],
    typesFilter?: AbsenceType[],
    orderBy: AbsenceListOrderBy = 'requestedAt-desc',
    itemsPerPage: number | 'all' = ITEMS_PER_PAGE,
    issuerIds?: CUID[],
    reviewerIds?: CUID[],
  ): Promise<Paginated<AbsenceDTO>> => {
    // Validate and normalize parameters
    const validPage = typeof page === 'number' && page > 0 ? page : 1;
    const validStartDate = startDate instanceof Date ? startDate : undefined;
    const validEndDate = endDate instanceof Date ? endDate : undefined;
    const validStatusFilter =
      Array.isArray(statusFilter) && statusFilter.length > 0 ? statusFilter : undefined;
    const validTypesFilter = Array.isArray(typesFilter) && typesFilter.length > 0 ? typesFilter : undefined;
    const validIssuerIds = Array.isArray(issuerIds) && issuerIds.length > 0 ? issuerIds : undefined;
    const validReviewerIds = Array.isArray(reviewerIds) && reviewerIds.length > 0 ? reviewerIds : undefined;

    const dateOverlapFilter =
      validStartDate && validEndDate
        ? {
            AND: [{ endDate: { gte: validStartDate } }, { startDate: { lte: validEndDate } }],
          }
        : validStartDate
          ? {
              endDate: { gte: validStartDate },
            }
          : validEndDate
            ? {
                startDate: { lte: validEndDate },
              }
            : undefined;

    const whereInput: OrganizationPrisma.AbsenceWhereInput = {
      ...(validIssuerIds ? { issuerId: { in: validIssuerIds } } : {}),
      ...(validReviewerIds ? { reviewerId: { in: validReviewerIds } } : {}),
      ...(validStatusFilter ? { status: { in: validStatusFilter } } : {}),
      ...(validTypesFilter ? { type: { in: validTypesFilter } } : {}),
      ...(dateOverlapFilter || {}),
    };

    // Ensure itemsPerPage is a valid number when not 'all'
    const validItemsPerPage =
      itemsPerPage === 'all'
        ? undefined
        : typeof itemsPerPage === 'number' && itemsPerPage > 0
          ? itemsPerPage
          : ITEMS_PER_PAGE;

    const [requests, count] = await Promise.all([
      db.absence.findMany({
        where: whereInput,
        orderBy: parseSort(orderBy),
        take: validItemsPerPage,
        skip: validItemsPerPage ? (validPage - 1) * validItemsPerPage : undefined,
      }),
      db.absence.count({ where: whereInput }),
    ]);

    const requested = [];
    const approved = [];
    const rejected = [];

    for (const req of requests) {
      switch (req.status) {
        case 'PENDING':
          requested.push(req);
          break;
        case 'APPROVED':
          approved.push(req);
          break;
        case 'REJECTED':
          rejected.push(req);
          break;
      }
    }

    const combined = [...requested, ...approved, ...rejected];

    return getPaginatedData(combined, page, count);
  };

  const getAllIssuerAbsenceDaysCount = async (
    _checker: unknown, // Accept checker for privateRoute wrapper, but don't use it
    issuerId: CUID,
    startDate?: Date,
    endDate?: Date,
    type?: AbsenceType,
    subtractGlobal?: boolean,
  ): Promise<number> => {
    let totalIntersectingBusinessDays = 0;

    const absences = await db.absence.findMany({
      where: {
        issuerId,
        status: AbsenceStatus.APPROVED,
        startDate: startDate ? { gte: startDate } : undefined,
        endDate: endDate ? { lte: endDate } : undefined,
        type: type ?? { in: ['HOLIDAY', 'SICK', 'PERSONAL'] },
      },
    });

    if (subtractGlobal) {
      const issuerGlobalAbsences = await db.absence.findMany({
        where: {
          startDate: startDate ? { gte: startDate } : undefined,
          endDate: endDate ? { lte: endDate } : undefined,
          status: 'APPROVED',
          recipientIds: {
            hasSome: [issuerId],
          },
          type: 'GLOBAL',
        },
      });

      totalIntersectingBusinessDays = countTakenDaysOff(issuerGlobalAbsences, absences);
    }

    return absences.reduce((acc, curr) => acc + curr.days, 0) - totalIntersectingBusinessDays;
  };

  const getAllAbsencesForCalendar = async () => {
    const absences = await db.absence.findMany({
      select: {
        startDate: true,
        endDate: true,
        type: true,
        status: true,
        days: true,
        issuerId: true,
        id: true,
        label: true,
      },
    });
    return absences;
  };

  const getAbsencesByTypeAndRange = async (
    from: Date,
    to: Date,
    type: AbsenceType[],
    employeeIds?: CUID[],
    ignoreRejected?: boolean,
  ): Promise<AbsenceDTO[]> => {
    const absences = await db.absence.findMany({
      where: {
        type: { in: type },
        AND: [{ startDate: { lte: to } }, { endDate: { gte: from } }],
        ...(employeeIds?.length ? { issuerId: { in: employeeIds } } : {}),
        ...(ignoreRejected ? { status: { not: 'REJECTED' } } : {}),
      },
    });

    return absences;
  };

  const getGlobalAbsencesByRange = async (from: Date, to: Date, ignoreRejected?: boolean) => {
    const globalAbsences = await db.absence.findMany({
      where: {
        type: 'GLOBAL',
        AND: [{ startDate: { lte: to } }, { endDate: { gte: from } }],
        ...(ignoreRejected ? { status: { not: 'REJECTED' } } : {}),
      },
    });

    return globalAbsences;
  };

  return {
    getAllAbsences,
    getAllIssuerAbsenceDaysCount,
    getAllAbsencesForCalendar,
    getAbsencesByTypeAndRange,
    getGlobalAbsencesByRange,
  };
}
