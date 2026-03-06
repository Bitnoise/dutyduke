import { type AbsenceDTO } from '@/api/hris/absences/model/dtos/absence.dto';
import { type EmployeeListItemDto } from '@/api/hris/employees/model/dtos';

export type EmployeeWithAbsences = EmployeeListItemDto & { absences: AbsenceDTO[] };

export function parseEmployeesWithAbsences(employees: EmployeeListItemDto[], absences: AbsenceDTO[]) {
  return employees.reduce((acc, employee) => {
    const employeeAbsences = absences.filter((absence) => absence.issuerId === employee.id);
    acc.push({ ...employee, absences: employeeAbsences });
    return acc;
  }, [] as EmployeeWithAbsences[]);
}
