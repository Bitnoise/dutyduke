import {
  employeeEquipmentController,
  type EmployeeEquipmentController,
  type EmployeesController,
  employeesController,
  type EmployeesDocumentsController,
  employeesDocumentsController,
  employeeSkillsController,
  type EmployeeSkillsController,
  type EmployeesPhotosController,
  employeesPhotosController,
} from '@/api/hris/employees/infrastructure/controllers';
import {
  type EmployeesEarningsController,
  employeesEarningsController,
} from '@/api/hris/employees/infrastructure/controllers/employees-earnings.controller';
import { type OrganizationContext } from '@/api/hris';

export type EmployeesApiType = EmployeesController &
  EmployeesEarningsController &
  EmployeeSkillsController &
  EmployeesDocumentsController &
  EmployeesPhotosController &
  EmployeeEquipmentController;

export function employeesApi(organizationContext: OrganizationContext): EmployeesApiType {
  return {
    ...employeesController(organizationContext),
    ...employeesEarningsController(organizationContext),
    ...employeeSkillsController(organizationContext),
    ...employeesDocumentsController(organizationContext),
    ...employeesPhotosController(organizationContext),
    ...employeeEquipmentController(organizationContext),
  };
}
