import { type Api } from '@/api/hris';
import { type CUID } from '@/shared';

export const DICTIONARIES = {
  employees: {
    skills: {
      id: 'skills',
      label: 'Skills',
      icon: 'copy',
      list: {
        provider: (api: Api, perPage: number, page: number, search?: string) =>
          api.resources.getAllSkillsList(page, perPage, search),
      },
      create: {
        provider: (api: Api, name: string) => api.resources.createSkill({ name }),
      },
      delete: {
        provider: (api: Api, id: CUID) => api.resources.deleteSkill(id),
      },
    },
  },
  resources: {
    category: {
      id: '1',
      label: 'category',
      icon: 'copy',
      list: {
        provider: (api: Api, perPage: number, page: number, search?: string) =>
          api.resources.getAllCategoriesList(page, perPage, search),
      },
      delete: {
        provider: (api: Api, id: CUID) => api.resources.deleteCategory(id),
      },
      create: {
        provider: (api: Api, name: string) => api.resources.createCategory(name),
      },
    },
    location: {
      id: '2',
      label: 'location',
      icon: 'building',
      list: {
        provider: (api: Api, perPage: number, page: number, search?: string) =>
          api.resources.getAllLocationsList(page, perPage, search),
      },
      delete: {
        provider: (api: Api, id: CUID) => api.resources.deleteEquipmentLocation(id),
      },
      create: {
        provider: (api: Api, name: string) => api.resources.createEquipmentLocation(name),
      },
    },
  },
};
