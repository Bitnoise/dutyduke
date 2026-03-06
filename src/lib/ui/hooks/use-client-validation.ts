'use client';

import { useState } from 'react';
import { type z, type ZodSchema } from 'zod';

/**
 * A custom React hook for client-side form validation using Zod schema.
 *
 * This to validate form data against a specified Zod schema client side.
 *
 * @template TSchema - A generic type that extends ZodSchema, representing
 * the schema used for validation.
 *
 * @param {TSchema} schema - The Zod schema used for validating the form
 * data.
 *
 * @param {z.infer<TSchema>} formData - The initial form data to be validated,
 * inferred from the provided Zod schema. This data should match the
 * structure defined by the schema.
 *
 * @returns {Object} An object containing:
 * - `formData`: The form data being validated.
 * - `formErrors`: An object containing any validation errors encountered,
 * keyed by field name. If there are no errors, this will be an empty object.
 * - `validateForm`: A function that accepts form data as an argument, performs
 * validation against the schema, and updates the `formErrors` state.
 * It returns a boolean indicating whether the validation was successful.
 */
export const useClientValidation = <TSchema extends ZodSchema>(
  schema: TSchema,
  formData: z.input<TSchema>,
) => {
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  /**
   * Function to validate data on client side.
   * @param {z.input<TSchema>} formData - data to validate corresponding with schema.
   * @returns boolean
   */
  const validateForm = (data: z.input<TSchema>) => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors: Partial<Record<keyof typeof data, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof data;
        errors[field] = issue.message;
      });
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  return {
    formData,
    formErrors,
    validateForm,
  };
};
