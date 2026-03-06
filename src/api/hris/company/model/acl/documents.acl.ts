import { type Nullable } from '@/shared';

export type DocumentsAcl = {
  uploadCompanyLogo(logo: File): Promise<Nullable<string>>;
  deleteCompanyLogo(filePath: string): Promise<boolean>;
};
