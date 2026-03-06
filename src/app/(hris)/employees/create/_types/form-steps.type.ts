import { type ActionReturnValidationErrorsType, type Steps } from '@/shared';
import { type EmployeeCreationForm } from '../_schemas';

export type FormSteps<TStep> = {
  errors: ActionReturnValidationErrorsType<EmployeeCreationForm> | undefined;
  currentStep: Steps;
  handleNextButtonClick(step?: TStep, formData?: EmployeeCreationForm): void;
  handleBackButtonClick(step?: TStep): void;
};
