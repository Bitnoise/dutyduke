type TranslationData = Record<string, string | Record<string, string>>;

const DEFAULT_LOCALE = 'en';

class TranslationManager {
  private static instance: TranslationManager;

  static getInstance(): TranslationManager {
    if (!TranslationManager.instance) {
      TranslationManager.instance = new TranslationManager();
    }
    return TranslationManager.instance;
  }

  async getTranslations(locale: string): Promise<TranslationData> {
    try {
      const translation = await import(`../../../../messages/${locale}.json`);
      return translation.default;
    } catch (_error) {
      // Fallback to default locale
    }

    try {
      const fallbackTranslation = await import(`../../../../messages/${DEFAULT_LOCALE}.json`);
      return fallbackTranslation.default;
    } catch (fallbackError) {
      console.error('Failed to load fallback translations:', fallbackError);
      return {};
    }
  }
}

export const translationManager = TranslationManager.getInstance();
