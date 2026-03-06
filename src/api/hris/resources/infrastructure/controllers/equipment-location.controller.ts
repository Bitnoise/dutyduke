import { type OrganizationContext } from '@/api/hris';
import { privateRoute, requirePermission, type PermissionChecker } from '@/api/hris/authorization';
import { ResourceType, PermissionAction } from '@/api/hris/authorization/permissions';
import { equipmentLocationQueries } from '@/api/hris/resources/infrastructure/database/queries';
import { equipmentLocationRepository } from '@/api/hris/resources/infrastructure/database/repositories';
import { type EquipmentLocationDto, type EquipmentLocationListDto } from '@/api/hris/resources/model/dtos';
import {
  createEquipmentLocationUseCase,
  deleteEquipmentLocationUseCase,
} from '@/api/hris/resources/model/use-cases';
import { type CUID, type Nullable } from '@/shared';

export type EquipmentLocationController = {
  getAllEquipmentLocations(): Promise<EquipmentLocationDto[]>;
  getEquipmentLocationByName(name: string): Promise<Nullable<EquipmentLocationDto>>;
  createEquipmentLocation(name: string): Promise<CUID>;
  deleteEquipmentLocation(id: CUID): Promise<void>;
  getAllLocationsList(page: number, perPage: number, search?: string): Promise<EquipmentLocationListDto>;
};

export function equipmentLocationController(
  organizationContext: OrganizationContext,
): EquipmentLocationController {
  const equipmentLocationRepositoryImpl = equipmentLocationRepository(organizationContext.db);
  const equipmentLocationQueriesImpl = equipmentLocationQueries(organizationContext.db);

  const createEquipmentLocation = async (checker: PermissionChecker, name: string) => {
    return createEquipmentLocationUseCase(equipmentLocationRepositoryImpl)(name);
  };

  const deleteEquipmentLocation = async (checker: PermissionChecker, id: CUID) => {
    return deleteEquipmentLocationUseCase(equipmentLocationRepositoryImpl)(id);
  };

  return {
    createEquipmentLocation: requirePermission(
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.EDIT,
      createEquipmentLocation,
    ),
    deleteEquipmentLocation: requirePermission(
      ResourceType.COMPANY_EQUIPMENT,
      PermissionAction.EDIT,
      deleteEquipmentLocation,
    ),
    getEquipmentLocationByName: privateRoute(async (checker: PermissionChecker, name: string) => {
      return equipmentLocationRepositoryImpl.getEquipmentLocationByName(name);
    }),
    getAllEquipmentLocations: privateRoute(async (_checker: PermissionChecker) => {
      return equipmentLocationQueriesImpl.getAllEquipmentLocations();
    }),
    getAllLocationsList: privateRoute(
      async (checker: PermissionChecker, page: number, perPage: number, search?: string) => {
        return equipmentLocationQueriesImpl.getAllLocationsList(page, perPage, search);
      },
    ),
  };
}
