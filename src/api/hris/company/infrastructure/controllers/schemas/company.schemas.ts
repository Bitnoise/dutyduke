import { type Nullable } from '@/shared';

export type UpsertCompanySchema = {
  name: string;
  logo: Nullable<File | string>;
  logoId: Nullable<string>;
};
