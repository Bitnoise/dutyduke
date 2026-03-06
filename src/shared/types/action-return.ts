type ActionSuccessReturnType<TData> = {
  status: 'success';
  data: TData;
};

export type ActionValidationErrorReturnType<TValidationError> = {
  status: 'validation-error';
  errors: TValidationError;
};

export type ActionErrorReturnType = {
  status: 'error';
  error: string;
};

export type ActionApiErrorReturnType = {
  status: 'api-error';
  code: number;
  error: string;
};

export type ActionDefaultReturnType = {
  status: 'idle';
};

export type ActionReturnType<TForm, TData, TValidationError> = { form: TForm } & (
  | ActionSuccessReturnType<TData>
  | ActionValidationErrorReturnType<TValidationError>
  | ActionErrorReturnType
  | ActionApiErrorReturnType
  | ActionDefaultReturnType
);

export type ActionReturnValidationErrorsType<TValidation> = Partial<
  Record<keyof TValidation, string[] | undefined>
>;

export type BaseActionReturnType<TData, TValidation, TForm> = ActionReturnType<TForm, TData, TValidation>;
