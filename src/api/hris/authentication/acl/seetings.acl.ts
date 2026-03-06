import {
  getDateFormatPattern,
  DEFAULT_DATE_FORMAT,
  type DateFormatKey,
} from '@/shared/constants/date-formats';
import { instantiateHrisApi, type OrganizationContext } from '../..';

export function settingsAcl(organizationContext: OrganizationContext) {
  const getLocale = async () => {
    const api = instantiateHrisApi(organizationContext);

    return api.settings.getLanguage();
  };

  const getDateFormat = async (): Promise<string> => {
    const api = instantiateHrisApi(organizationContext);
    const dateFormatKey = await api.settings.getDateFormat();

    return getDateFormatPattern((dateFormatKey as DateFormatKey) ?? DEFAULT_DATE_FORMAT);
  };

  return {
    getLocale,
    getDateFormat,
  };
}
