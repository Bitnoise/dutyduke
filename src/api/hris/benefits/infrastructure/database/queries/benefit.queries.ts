import { type OrganizationContext } from '@/api/hris';
import { type OrganizationPrisma } from '@/api/hris/prisma/client';
import {
  getPaginatedData,
  parseSort,
  type CUID,
  type Paginated,
  ITEMS_PER_PAGE,
  containsQuery,
  type OrderBy,
} from '@/shared';
import { type BenefitListItemDto, type EmployeeBenefitListItemDto } from '../../../model/dtos/benefit.dtos';

export type BenefitOrderBy = Extract<OrderBy, 'name-asc' | 'name-desc' | 'createdAt-asc' | 'createdAt-desc'>;
export type EmployeeBenefitOrderBy = Extract<
  OrderBy,
  'name-asc' | 'name-desc' | 'startDate-asc' | 'startDate-desc' | 'lastName-asc' | 'lastName-desc'
>;

function parseEmployeeBenefitOrderBy(orderBy?: EmployeeBenefitOrderBy) {
  if (!orderBy) return undefined;

  // For nested relations, we need custom handling
  if (orderBy.startsWith('name-')) {
    const [, dir] = orderBy.split('-') as [string, 'asc' | 'desc'];
    return { benefit: parseSort(`name-${dir}` as OrderBy) };
  }

  if (orderBy.startsWith('lastName-')) {
    const [, dir] = orderBy.split('-') as [string, 'asc' | 'desc'];
    return { employee: parseSort(`lastName-${dir}` as OrderBy) };
  }

  // For direct fields like startDate, use parseSort directly
  return parseSort(orderBy);
}

export type BenefitQueries = {
  getBenefitList: (
    page: number,
    orderBy?: BenefitOrderBy,
    query?: string,
    perPage?: number,
  ) => Promise<Paginated<BenefitListItemDto>>;
  getEmployeeBenefitList: (
    employeeId: CUID,
    page: number,
    orderBy?: EmployeeBenefitOrderBy,
    perPage?: number,
  ) => Promise<Paginated<EmployeeBenefitListItemDto>>;
  getEmployeesWithBenefits: (
    page: number,
    orderBy?: EmployeeBenefitOrderBy,
    query?: string,
    perPage?: number,
  ) => Promise<Paginated<EmployeeBenefitListItemDto>>;
  getEmployeeCountByBenefitId: (benefitId: CUID) => Promise<number>;
};

export function benefitQueries(organizationContext: OrganizationContext): BenefitQueries {
  const { db } = organizationContext;

  const getBenefitList = async (
    page: number,
    orderBy?: BenefitOrderBy,
    query?: string,
    perPage: number = ITEMS_PER_PAGE,
  ): Promise<Paginated<BenefitListItemDto>> => {
    const searchFilter: OrganizationPrisma.BenefitWhereInput = query
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        }
      : {};

    const [benefits, totalItems] = await Promise.all([
      db.benefit.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
          note: true,
          employeeBenefits: {
            select: {
              employee: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatarId: true,
                },
              },
            },
          },
        },
        where: searchFilter,
        orderBy: orderBy ? parseSort(orderBy) : undefined,
        take: perPage,
        skip: (page - 1) * perPage,
      }),
      db.benefit.count({
        where: searchFilter,
      }),
    ]);

    const benefitList: BenefitListItemDto[] = benefits.map((benefit) => ({
      id: benefit.id,
      name: benefit.name,
      note: benefit.note,
      createdAt: benefit.createdAt,
      assignedEmployees: benefit.employeeBenefits.map((eb) => ({
        id: eb.employee.id,
        firstName: eb.employee.firstName,
        lastName: eb.employee.lastName,
        avatarId: eb.employee.avatarId,
      })),
    }));

    return getPaginatedData(benefitList, page, totalItems, perPage);
  };

  const getEmployeeBenefitList = async (
    employeeId: CUID,
    page: number,
    orderBy?: EmployeeBenefitOrderBy,
    perPage: number = ITEMS_PER_PAGE,
  ): Promise<Paginated<EmployeeBenefitListItemDto>> => {
    const [employeeBenefits, totalItems] = await Promise.all([
      db.employeeBenefit.findMany({
        where: {
          employeeId,
        },
        include: {
          benefit: {
            select: {
              id: true,
              name: true,
            },
          },
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              status: true,
              avatarId: true,
            },
          },
        },
        orderBy: parseEmployeeBenefitOrderBy(orderBy),
        take: perPage,
        skip: (page - 1) * perPage,
      }),
      db.employeeBenefit.count({
        where: {
          employeeId,
        },
      }),
    ]);

    const employeeBenefitList: EmployeeBenefitListItemDto[] = employeeBenefits.map((eb) => ({
      id: eb.id,
      benefitId: eb.benefitId,
      employeeId: eb.employeeId,
      startDate: eb.startDate,
      benefit: {
        id: eb.benefit.id,
        name: eb.benefit.name,
      },
      employee: {
        id: eb.employee.id,
        firstName: eb.employee.firstName,
        lastName: eb.employee.lastName,
        isActive: eb.employee.status === 'ACTIVE',
        avatarId: eb.employee.avatarId,
      },
    }));

    return getPaginatedData(employeeBenefitList, page, totalItems, perPage);
  };

  const getEmployeesWithBenefits = async (
    page: number,
    orderBy?: EmployeeBenefitOrderBy,
    query?: string,
    perPage: number = ITEMS_PER_PAGE,
  ): Promise<Paginated<EmployeeBenefitListItemDto>> => {
    const searchFilter: OrganizationPrisma.EmployeeBenefitWhereInput = query
      ? {
          OR: [
            {
              employee: {
                firstName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
            {
              employee: {
                lastName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
            {
              benefit: {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          ],
        }
      : {};

    const [employeeBenefits, totalItems] = await Promise.all([
      db.employeeBenefit.findMany({
        where: searchFilter,
        include: {
          benefit: {
            select: {
              id: true,
              name: true,
            },
          },
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              status: true,
              avatarId: true,
            },
          },
        },
        orderBy: parseEmployeeBenefitOrderBy(orderBy),
        take: perPage,
        skip: (page - 1) * perPage,
      }),
      db.employeeBenefit.count({
        where: searchFilter,
      }),
    ]);

    const parsedQuery = query?.length ? decodeURIComponent(query) : undefined;

    const employeeBenefitList: EmployeeBenefitListItemDto[] = [];

    for (const eb of employeeBenefits) {
      const employeeBenefit: EmployeeBenefitListItemDto = {
        id: eb.id,
        benefitId: eb.benefitId,
        employeeId: eb.employeeId,
        startDate: eb.startDate,
        benefit: {
          id: eb.benefit.id,
          name: eb.benefit.name,
        },
        employee: {
          id: eb.employee.id,
          firstName: eb.employee.firstName,
          lastName: eb.employee.lastName,
          isActive: eb.employee.status === 'ACTIVE',
          avatarId: eb.employee.avatarId,
        },
      };

      if (parsedQuery && !containsQuery(employeeBenefit, parsedQuery)) {
        continue;
      }

      employeeBenefitList.push(employeeBenefit);
    }

    return getPaginatedData(employeeBenefitList, page, totalItems, perPage);
  };

  const getEmployeeCountByBenefitId = async (benefitId: CUID): Promise<number> => {
    return await db.employeeBenefit.count({
      where: {
        benefitId,
      },
    });
  };

  return {
    getBenefitList,
    getEmployeeBenefitList,
    getEmployeesWithBenefits,
    getEmployeeCountByBenefitId,
  };
}
