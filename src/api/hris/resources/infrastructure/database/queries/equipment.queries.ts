import { type OrganizationContext } from '@/api/hris';
import { type OrganizationPrisma } from '@/api/hris/prisma/client';
import { employeesAcl } from '@/api/hris/resources/acl';
import { serializeEquipment } from '@/api/hris/resources/infrastructure/database/utils';
import {
  type EquipmentDto,
  type EquipmentAssignStatus,
  type EquipmentListItemDto,
  type EquipmentStatus,
  type EquipmentGeneralDataDto,
} from '@/api/hris/resources/model/dtos';
import {
  type EquipmentOrderBy,
  getPaginatedData,
  parseSort,
  type CUID,
  containsQuery,
  type Nullable,
  type Paginated,
} from '@/shared';

export type EquipmentQueries = {
  getEquipmentGeneralData: (equipmentId: CUID) => Promise<Nullable<EquipmentGeneralDataDto>>;
  getEquipmentList: (
    page: number,
    orderBy: EquipmentOrderBy,
    statusFilter: EquipmentStatus[],
    assignFilter: EquipmentAssignStatus[],
    perPage: number,
    categoryId?: CUID,
    query?: string,
    assigneeId?: CUID,
    equipmentIds?: CUID[],
  ) => Promise<Paginated<EquipmentListItemDto>>;
  getEquipmentById: (equipmentId: CUID) => Promise<Nullable<EquipmentDto>>;
  getAllEquipments: (
    status: EquipmentStatus[],
    filter: EquipmentAssignStatus[],
    category?: Nullable<CUID>,
    assigneeId?: CUID,
  ) => Promise<EquipmentDto[]>;
};

export function equipmentQueries(organizationContext: OrganizationContext): EquipmentQueries {
  const { db } = organizationContext;

  const employeesAclImpl = employeesAcl(organizationContext);

  const getEquipmentGeneralData = async (equipmentId: CUID) => {
    const equipmentGeneralData = await db.equipment.findUnique({
      where: {
        id: equipmentId,
      },
      include: {
        category: true,
        location: true,
      },
    });

    return serializeEquipment(equipmentGeneralData);
  };

  const getEquipmentById = async (equipmentId: CUID): Promise<Nullable<EquipmentDto>> => {
    const equipment = await db.equipment.findUnique({
      where: {
        id: equipmentId,
      },
      include: {
        category: true,
      },
    });

    return serializeEquipment(equipment);
  };

  const getEquipmentList = async (
    page: number,
    orderBy: EquipmentOrderBy,
    statusFilter: EquipmentStatus[],
    assignFilter: EquipmentAssignStatus[],
    perPage: number,
    categoryId?: CUID,
    query?: string,
    assigneeId?: CUID,
    equipmentIds?: CUID[],
  ) => {
    const handleFilterByAssignFilter = (): OrganizationPrisma.EquipmentWhereInput => {
      if (assigneeId) {
        return {
          assigneeId,
        };
      }

      if (assignFilter.includes('ASSIGNED') && assignFilter.includes('FREE')) {
        return {};
      }

      if (assignFilter.includes('ASSIGNED')) {
        return {
          assigneeId: {
            not: null,
          },
        };
      }

      if (assignFilter.includes('FREE')) {
        return {
          assigneeId: null,
        };
      }

      return {};
    };

    const [equipmentList, totalItems] = await Promise.all([
      db.equipment.findMany({
        select: {
          id: true,
          signature: true,
          brand: true,
          model: true,
          name: true,
          status: true,
          assigneeId: true,
          category: {
            select: { name: true },
          },
        },
        orderBy: parseSort(orderBy),
        where: {
          ...(categoryId && {
            categoryId,
          }),
          ...(statusFilter && {
            status: {
              in: statusFilter,
            },
          }),
          ...(equipmentIds?.length && { id: { in: equipmentIds } }),
          ...handleFilterByAssignFilter(),
        },
        take: perPage,
        skip: (page - 1) * perPage,
      }),
      db.equipment.count({
        where: {
          ...(categoryId && {
            categoryId,
          }),
          ...(statusFilter && {
            status: {
              in: statusFilter,
            },
          }),
          ...(equipmentIds?.length && { id: { in: equipmentIds } }),
          ...handleFilterByAssignFilter(),
        },
      }),
    ]);

    const parsedQuery = query?.length ? decodeURIComponent(query) : undefined;

    const parsedEquipmentList: EquipmentListItemDto[] = [];

    for (const equipment of equipmentList) {
      const { category, assigneeId, ...restEquipment } = equipment;

      const parsedEquipment = {
        ...restEquipment,
        category: category?.name ?? null,
        assignee: assigneeId ? await employeesAclImpl.getEmployeeById(assigneeId) : null,
      };

      if (parsedQuery && !containsQuery(parsedEquipment, parsedQuery)) {
        continue;
      }

      parsedEquipmentList.push(parsedEquipment);
    }

    return getPaginatedData(parsedEquipmentList, page, totalItems, perPage);
  };

  const getAllEquipments = async (
    status: EquipmentStatus[],
    filter: EquipmentAssignStatus[],
    category?: Nullable<CUID>,
    assigneeId?: CUID,
  ) => {
    const whereAssignStatus =
      filter.includes('ASSIGNED') && filter.includes('FREE')
        ? {}
        : { assigneeId: filter.includes('ASSIGNED') ? { not: null } : null };

    const equipments = await db.equipment.findMany({
      where: {
        ...(category && { categoryId: category }),
        status: {
          in: status,
        },
        ...whereAssignStatus,
        assigneeId,
      },

      include: {
        category: true,
      },
    });

    return equipments.map((eq) => serializeEquipment(eq)!);
  };

  return {
    getEquipmentGeneralData,
    getEquipmentList,
    getEquipmentById,
    getAllEquipments,
  };
}
