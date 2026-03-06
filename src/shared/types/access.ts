export type WithAccess<TData, TAccess> = TData & {
  _access: TAccess;
};
