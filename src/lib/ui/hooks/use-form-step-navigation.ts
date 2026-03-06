'use client';

import { useCallback, useState } from 'react';
import { type Steps, type FormStep } from '@/shared';

/**
 * Custom hook to manage navigation between form steps.
 *
 * @template T - A string that represents the step identifier.
 * @param initialStep - The initial step to start with.
 * @param  formSteps - An array of steps that the form needs to navigate through.
 * @returns - Contains handlers for navigating steps and the current state:
 *  - `handleGoToNextStep`: Moves to the next step and marks it as dirty.
 *  - `handleGoToPreviousStep`: Moves to the previous step without marking it dirty.
 *  - `currentStep`: The current step.
 *  - `steps`: The array of steps with updated state.
 *  - `setCurrentStep`: Manually sets the current step without making it dirty.
 */
export const useFormStepsNavigation = <TSteps = Steps>(
  initialStep: TSteps,
  formSteps: FormStep<TSteps>[],
) => {
  const [currentStep, setCurrentStep] = useState<TSteps>(initialStep);
  const [steps, setSteps] = useState<FormStep<TSteps>[]>(formSteps);
  /**
   * Handles navigating between the steps.
   * @param {T} nextStep - The next step to navigate to.
   */
  const handleGoToNextStep = useCallback(
    (nextStep: TSteps) => {
      const updatedSteps = steps.map((prevStep) =>
        prevStep.stepId === nextStep ? { ...prevStep, isDirty: true } : prevStep,
      );

      setSteps(updatedSteps);
      setCurrentStep(nextStep);
    },
    [steps],
  );

  /**
   * Handles navigating to the previous step.
   * @param {T} previousStep - The previous step to navigate to.
   */
  const handleGoToPreviousStep = useCallback((previousStep: TSteps) => setCurrentStep(previousStep), []);

  return { handleGoToNextStep, handleGoToPreviousStep, currentStep, steps, setCurrentStep };
};
