import { type OrganizationContext } from '..';
import { absenceController } from './infrastructure/controllers/absence.controller';

export const absencesApi = (organization: OrganizationContext) => {
  return {
    ...absenceController(organization),
  };
};
