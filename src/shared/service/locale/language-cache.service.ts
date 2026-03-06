import { DEFAULT_LANGUAGE } from '@/shared/constants/languages';

const LANGUAGE_CACHE_KEY = 'user-language';

export class LanguageCacheService {
  static getLanguageFromCache(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LANGUAGE_CACHE_KEY);
  }

  static setLanguageInCache(language: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LANGUAGE_CACHE_KEY, language);
  }

  static clearLanguageCache(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LANGUAGE_CACHE_KEY);
  }

  static getLanguageWithFallback(): string {
    return this.getLanguageFromCache() ?? DEFAULT_LANGUAGE;
  }
}
