export type InputType = 'text' | 'email' | 'date' | 'tel';

export type ListEntry<T> = {
  key: keyof T;
  type: InputType;
};
