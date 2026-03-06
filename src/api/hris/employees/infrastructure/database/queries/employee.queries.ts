import {
  type CUID,
  type EmployeeListOrderBy,
  getPaginatedData,
  type Nullable,
  type Paginated,
  parseSort,
} from '@/shared';
import { EMPLOYEE_ERROR_MESSAGES } from '@/api/hris/employees/errors';
import { type OrganizationContext } from '@/api/hris';
import {
  type EmployeeListItemDto,
  type EmployeeGeneralInfoDto,
  type BaseEmployeeDto,
  type EmployeeStatusDto,
  type AssignedEmployeeDto,
} from '@/api/hris/employees/model/dtos';
import { type OrganizationPrisma, type EmployeeStatus } from '@/api/hris/prisma/client';

type EmployeeQuery = {
  getEmployeeGeneralInfo: (employeeId: CUID) => Promise<EmployeeGeneralInfoDto>;
  getAllEmployees: (query?: string, limit?: number) => Promise<BaseEmployeeDto[]>;
  getEmployeeById: (employeeId: CUID) => Promise<Nullable<BaseEmployeeDto>>;
  getEmployeeByIdentityId: (identityId: CUID) => Promise<Nullable<BaseEmployeeDto>>;
  getEmployeeByEmail: (email: string) => Promise<Nullable<BaseEmployeeDto>>;
  getAllEmployeesList: (
    page: number,
    search: string,
    orderBy: EmployeeListOrderBy,
    perPage: number,
    filters: EmployeeStatusDto[],
    employeeIdFilter?: CUID, // Optional filter for SELF scope
  ) => Promise<Paginated<EmployeeListItemDto>>;
  getEmployeeByDocumentId: (documentId: CUID) => Promise<Nullable<AssignedEmployeeDto>>;
  queryEmployees(query: string): Promise<CUID[]>;
  getEmployeesById: (employeeIds: CUID[]) => Promise<BaseEmployeeDto[]>;
  getEmployeesCount: () => Promise<number>;
};

export function employeeQueries(organizationContext: OrganizationContext): EmployeeQuery {
  const { db } = organizationContext;

  const employeeSchemaSelect = {
    id: true,
    firstName: true,
    lastName: true,
    role: true,
    avatarId: true,
    workEmail: true,
    status: true,
    identityId: true,
    phone: true,
    documentIds: true,
    photosIds: true,
    holiday: true,
    firstYearHoliday: true,
    joinDate: true,
  };

  const getEmployeeGeneralInfo = async (employeeId: CUID): Promise<EmployeeGeneralInfoDto> => {
    const employee = await db.employee.findUnique({
      where: { id: employeeId },
      include: {
        children: true,
        additionalEmails: true,
      },
    });

    if (!employee) {
      throw new Error(EMPLOYEE_ERROR_MESSAGES.NOT_FOUND(employeeId));
    }

    return {
      id: employee.id,
      identityId: employee.identityId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      personalId: employee.personalId,
      birthdate: employee.birthdate,
      avatarId: employee.avatarId,
      role: employee.role,
      employmentType: employee.employmentType,
      taxId: employee.taxId,
      bankAccount: employee.bankAccount,
      holiday: employee.holiday,
      firstYearHoliday: employee.firstYearHoliday,
      joinDate: employee.joinDate,
      workEmail: employee.workEmail,
      additionalEmails: employee.additionalEmails.map(({ email }) => email),
      phone: employee.phone,
      address: employee.address,
      iceName: employee.iceName,
      icePhone: employee.icePhone,
      documentIds: employee.documentIds,
      description: employee.description,
      hobbies: employee.hobbies,
      status: employee.status as EmployeeStatusDto,
      children: employee.children.map(({ id, birthDate, name }) => ({
        id,
        birthDate,
        name,
      })),
      photosIds: employee.photosIds,
    };
  };

  const getAllEmployees = async (query?: string, limit?: number): Promise<BaseEmployeeDto[]> => {
    const parsedQuery = decodeURIComponent(query ?? '');

    const employees = await db.employee.findMany({
      select: employeeSchemaSelect,
      take: limit,
      where: {
        status: {
          not: 'ARCHIVED' as EmployeeStatus,
        },
        ...(parsedQuery && {
          OR: [
            {
              firstName: {
                contains: parsedQuery,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: parsedQuery,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
      orderBy: { lastName: 'asc' },
    });

    return employees.map((emp) => ({
      ...emp,
      status: emp.status as EmployeeStatusDto,
    }));
  };

  const getAllEmployeesList = async (
    page: number,
    search: string,
    orderBy: EmployeeListOrderBy = 'lastName-asc',
    perPage: number,
    filters: EmployeeStatusDto[],
    employeeIdFilter?: CUID, // Optional filter for SELF scope
  ) => {
    const decodedSearch = decodeURIComponent(search).trim();
    const [term1, term2] = decodedSearch
      .split(' ')
      .map((term) => term.trim())
      .filter(Boolean);

    // Filter out invalid enum values and cast to Prisma enum type
    // Only ACTIVE and ARCHIVED are valid according to the Prisma schema
    // Default to ACTIVE if all filters are invalid
    const validFilters = (() => {
      const filtered = filters.filter(
        (f): f is EmployeeStatusDto => f === 'ACTIVE' || f === 'ARCHIVED',
      ) as EmployeeStatus[];
      return filtered.length > 0 ? filtered : (['ACTIVE'] as EmployeeStatus[]);
    })();

    const where: OrganizationPrisma.EmployeeWhereInput = {
      ...(employeeIdFilter && { id: employeeIdFilter }), // SELF scope filtering
      ...(decodedSearch && {
        OR: [
          { firstName: { startsWith: term1, mode: 'insensitive' } },
          { lastName: { startsWith: term1, mode: 'insensitive' } },
          {
            ...(term2 && {
              OR: [
                { lastName: { startsWith: term2, mode: 'insensitive' } },
                { firstName: { startsWith: term2, mode: 'insensitive' } },
              ],
              AND: [
                { firstName: { startsWith: term1, mode: 'insensitive' } },
                { lastName: { startsWith: term2, mode: 'insensitive' } },
              ],
            }),
          },
          { workEmail: { equals: term1, mode: 'insensitive' } },
        ],
      }),
      status: {
        in: validFilters,
      },
    };

    const [employees, totalItems] = await Promise.all([
      db.employee.findMany({
        take: perPage,
        skip: (page - 1) * perPage,
        where,
        select: employeeSchemaSelect,
        orderBy: parseSort(orderBy),
      }),
      db.employee.count({ where }),
    ]);

    const mappedEmployees = employees.map((emp) => ({
      ...emp,
      status: emp.status as EmployeeStatusDto,
    }));

    return getPaginatedData(mappedEmployees, page, totalItems, perPage);
  };

  const getEmployeeById = async (employeeId: CUID) => {
    const employee = await db.employee.findUnique({
      select: employeeSchemaSelect,
      where: { id: employeeId },
    });

    if (!employee) return null;

    return {
      ...employee,
      status: employee.status as EmployeeStatusDto,
    };
  };

  const getEmployeeByIdentityId = async (identityId: CUID) => {
    const employee = await db.employee.findFirst({
      select: employeeSchemaSelect,
      where: { identityId },
    });

    if (!employee) return null;

    return {
      ...employee,
      status: employee.status as EmployeeStatusDto,
    };
  };

  const getEmployeeByEmail = async (email: string) => {
    const employee = await db.employee.findFirst({
      select: employeeSchemaSelect,
      where: { workEmail: email },
    });

    if (!employee) return null;

    return {
      ...employee,
      status: employee.status as EmployeeStatusDto,
    };
  };

  const getEmployeeByDocumentId = async (documentId: CUID) => {
    const employee = await db.employee.findFirst({
      where: {
        OR: [{ documentIds: { hasSome: [documentId] } }, { photosIds: { hasSome: [documentId] } }],
      },
      select: {
        id: true,
        avatarId: true,
        firstName: true,
        lastName: true,
      },
    });

    return employee || null;
  };

  const queryEmployees = async (query: string) => {
    const employees = await db.employee.findMany({
      where: {
        OR: [
          { firstName: { startsWith: query, mode: 'insensitive' } },
          { lastName: { startsWith: query, mode: 'insensitive' } },
          { workEmail: query },
        ],
      },
      select: { id: true },
    });

    return employees.map((e) => e.id);
  };

  const getEmployeesById = async (employeeIds: CUID[]) => {
    const employees = await db.employee.findMany({
      select: employeeSchemaSelect,
      where: { id: { in: employeeIds } },
    });

    return employees.map((emp) => ({
      ...emp,
      status: emp.status as EmployeeStatusDto,
    }));
  };

  const getEmployeesCount = async () => db.employee.count();

  return {
    getEmployeeGeneralInfo,
    getAllEmployees,
    getEmployeeById,
    getEmployeeByIdentityId,
    getEmployeeByEmail,
    getAllEmployeesList,
    getEmployeeByDocumentId,
    queryEmployees,
    getEmployeesById,
    getEmployeesCount,
  };
}
