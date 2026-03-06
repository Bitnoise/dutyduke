import { type Steps, type FormStep } from '@/shared';

export type StepsNavigation = {
  [key in Steps]: {
    prev?: Steps;
    next?: Steps;
  };
};

export const STEPS: FormStep[] = [
  {
    isDirty: true,
    stepId: 'basicInformation',
    title: 'basicInformation',
  },
  {
    isDirty: false,
    stepId: 'partnership',
    title: 'partnership',
  },
];

export const STEPS_NAVIGATION: StepsNavigation = {
  basicInformation: {
    prev: undefined,
    next: 'partnership',
  },
  partnership: {
    prev: 'basicInformation',
    next: undefined,
  },
};
