import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '@/shared/service/locale/user-locale.service';
import { translationManager } from '@/shared/service/locale/translation-manager';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  try {
    const messages = await translationManager.getTranslations(locale);
    return {
      locale,
      messages,
    };
  } catch (error) {
    // Ultimate fallback - try to load local file directly
    try {
      const fallbackMessages = (await import(`../messages/${locale}.json`)).default;
      return {
        locale,
        messages: fallbackMessages,
      };
    } catch (fallbackError) {
      console.error('Failed to load translations:', fallbackError);
      return {
        locale,
        messages: {},
      };
    }
  }
});
