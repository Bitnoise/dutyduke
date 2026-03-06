export type CUID = string;

export type WithId<T> = T & {
  id: CUID;
};

export type WithoutId<T> = Omit<T, 'id'>;
