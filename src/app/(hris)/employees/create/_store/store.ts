import { atom, createStore } from 'jotai';
import { type EmployeeCreationForm } from '../_schemas';

export const store = createStore();

export const employeeCreationAtom = atom<EmployeeCreationForm>({
  firstName: '',
  lastName: '',
  workEmail: '',
  role: '',
  joinDate: '',
  bankAccount: '',
  employmentType: '',
  taxId: '',
  holiday: '',
  firstYearHoliday: '',
});
