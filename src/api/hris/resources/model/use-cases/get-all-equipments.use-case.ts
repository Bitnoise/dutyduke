import { type EquipmentStatus } from '@/api/hris/prisma/client';
import { type EquipmentAssignStatus, type EquipmentDto } from '@/api/hris/resources/model/dtos';
import { ApiError, API_ERROR_MESSAGES, type CUID } from '@/shared';
import { type EquipmentQueries } from '../../infrastructure/database/queries';

export function getAllEquipmentsUseCase(equipmentQueries: EquipmentQueries) {
  return async (
    category?: string,
    status?: string,
    filter?: string,
    assigneeId?: CUID,
  ): Promise<EquipmentDto[]> => {
    const parsedCategoryFilter = category === 'ALL' ? undefined : category;
    const parsedStatusFilter = (
      status ? status.split(',') : ['ARCHIVED', 'BROKEN', 'IN_SERVICE', 'WORKING']
    ) as EquipmentStatus[];
    const parsedFilterParam = (filter ? filter.split(',') : ['ASSIGNED', 'FREE']) as EquipmentAssignStatus[];

    const equipments = await equipmentQueries.getAllEquipments(
      parsedStatusFilter,
      parsedFilterParam,
      parsedCategoryFilter,
      assigneeId,
    );

    if (!equipments) {
      throw new ApiError(400, API_ERROR_MESSAGES.EQUIPMENT.NOT_FOUND_MULTIPLE);
    }

    return equipments;
  };
}
