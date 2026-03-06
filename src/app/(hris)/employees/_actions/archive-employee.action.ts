'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import { type CUID, handleActionError, HRIS_ROUTES } from '@/shared';

// Extract pathname from route to invalidate all filter variations
const getEmployeesListPath = (): string => {
  return HRIS_ROUTES.employees.base.split('?')[0];
};

export async function archiveEmployee(employeeId: CUID) {
  const api = hrisApi;

  try {
    const employee = await api.employees.getEmployeeById(employeeId);

    if (!employee || employee.status === 'ARCHIVED') return;

    // Do NOT delete identity - identity is managed by UI
    await api.employees.archiveEmployee(employee.id);

    // Revalidate without query params to invalidate all filter variations
    revalidatePath(getEmployeesListPath(), 'page');
    return {
      status: 'success' as const,
    };
  } catch (err) {
    return { ...handleActionError(err) };
  }
}

export async function archiveEmployees(employeeIds: CUID[] | 'all') {
  const api = hrisApi;
  let employeeIdsToArchive = employeeIds;

  if (employeeIds === 'all') {
    const employees = await api.employees.getAllEmployees();

    employeeIdsToArchive = employees.map((employee) => employee.id);
  }

  // Process all employees first, then revalidate once at the end
  for (const employeeId of employeeIdsToArchive) {
    const employee = await api.employees.getEmployeeById(employeeId);
    if (!employee || employee.status === 'ARCHIVED') continue;

    // Do NOT delete identity - identity is managed by UI
    await api.employees.archiveEmployee(employee.id);
  }

  // Revalidate once after all operations complete
  revalidatePath(getEmployeesListPath(), 'page');
}
