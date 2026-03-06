import { DICTIONARIES } from '@/shared/constants/dictionaries';
import { type Dictionary, type DictionaryPaginatedEntities } from '@/shared/types/dictionary';
import { type IconNames } from '@/lib/ui/icons';
import { type Api } from '@/api/hris';
import { type CUID } from '@/api/hris/types';

interface DictionaryTab {
  id: string;
  label: string;
  icon: IconNames;
  href: string;
}

export type DictionaryArea = keyof typeof DICTIONARIES;
export type DictionaryName<T extends DictionaryArea> = keyof (typeof DICTIONARIES)[T];

export const getDictionarySubsections = (
  area: DictionaryArea,
  tabsRouting: Record<string, (subsection: string) => string>,
): DictionaryTab[] => {
  const subsections = Object.keys(DICTIONARIES[area]) as DictionaryName<typeof area>[];

  return subsections.map((subsection) => {
    const config = DICTIONARIES[area][subsection] as Dictionary;

    return {
      id: config.id,
      label: config.label.toLowerCase(),
      icon: config.icon as IconNames,
      href: tabsRouting['base'](subsection as string),
    };
  });
};

export const getDictionaryEntitiesProvider = async (
  api: Api,
  area: DictionaryArea,
  name: DictionaryName<typeof area>,
  perPage: number,
  page?: number,
  search?: string,
): Promise<DictionaryPaginatedEntities> => {
  const config = DICTIONARIES[area][name] as Dictionary;
  return config.list.provider(api, perPage, page, search);
};

export const deleteDictionaryEntityProvider = async (
  api: Api,
  area: DictionaryArea,
  name: DictionaryName<typeof area>,
  id: CUID,
): Promise<void> => {
  const config = DICTIONARIES[area][name] as Dictionary;
  return config.delete.provider(api, id);
};

export const createDictionaryEntityProvider = async (
  api: Api,
  area: DictionaryArea,
  dictionaryName: DictionaryName<typeof area>,
  name: string,
): Promise<CUID> => {
  const config = DICTIONARIES[area][dictionaryName] as Dictionary;
  return config.create.provider(api, name);
};
