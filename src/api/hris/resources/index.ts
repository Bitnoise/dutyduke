import { type OrganizationContext } from '@/api/hris';
import {
  equipmentCategoryController,
  skillsController,
} from '@/api/hris/resources/infrastructure/controllers';
import { equipmentLocationController } from '@/api/hris/resources/infrastructure/controllers/equipment-location.controller';
import { equipmentController } from '@/api/hris/resources/infrastructure/controllers/equipment.controller';
import { equipmentDocumentsController } from './infrastructure/controllers/equipment-documents.controller';

export function resourcesApi(organizationContext: OrganizationContext) {
  const skillsControllerImpl = skillsController(organizationContext.db);
  const equipmentCategoryControllerImpl = equipmentCategoryController(organizationContext);
  const equipmentControllerImpl = equipmentController(organizationContext);
  const equipmentLocationControllerImpl = equipmentLocationController(organizationContext);
  const equipmentDocumentsControllerImpl = equipmentDocumentsController(organizationContext);

  return {
    ...skillsControllerImpl,
    ...equipmentControllerImpl,
    ...equipmentCategoryControllerImpl,
    ...equipmentLocationControllerImpl,
    ...equipmentDocumentsControllerImpl,
  };
}
