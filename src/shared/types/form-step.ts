export type FormStep<TSteps = Steps> = {
  isDirty: boolean;
  stepId: TSteps;
  title: string;
};

export type Steps = 'basicInformation' | 'partnership';
