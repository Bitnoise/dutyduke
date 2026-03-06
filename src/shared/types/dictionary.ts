import { type Api } from '@/api/hris';
import { type CUID } from '@/api/hris/types';
import { type CreateDictionaryEntitySchema } from '@/shared/schemas/creaate-dictionary-entity.schema';
import { type Paginated } from '@/shared';
import { type ActionReturnType, type ActionReturnValidationErrorsType } from './action-return';

export interface Dictionary {
  id: string;
  label: string;
  icon: string;
  list: {
    provider: (
      api: Api,
      perPage: number,
      page?: number,
      search?: string,
    ) => Promise<DictionaryPaginatedEntities>;
  };
  delete: {
    provider: (api: Api, id: CUID) => Promise<void>;
  };
  create: {
    provider: (api: Api, name: string) => Promise<CUID>;
  };
}

export type DictionaryPaginatedEntities = Paginated<DictionaryEntity>;

export type DictionaryEntity = {
  actions: { label: string; url: string }[];
  id: string;
  name: string;
};

export type CreateDictionaryEntityActionState = ActionReturnType<
  CreateDictionaryEntitySchema,
  undefined,
  ActionReturnValidationErrorsType<CreateDictionaryEntitySchema>
>;
