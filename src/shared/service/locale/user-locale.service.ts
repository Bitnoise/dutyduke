import { DEFAULT_LANGUAGE } from '@/shared/constants/languages';
import { logger } from '@/shared/service/pino';
import { LanguageCacheService } from './language-cache.service';

// Check if we're in a build environment (no database available)
function isBuildTime(): boolean {
  return process.env.npm_lifecycle_event === 'build' || process.env.NEXT_PHASE === 'phase-production-build';
}

export async function getUserLocale() {
  // During build, skip database queries and use default language
  if (isBuildTime()) {
    return DEFAULT_LANGUAGE;
  }

  try {
    // Try to get from cache first
    const cachedLanguage = LanguageCacheService.getLanguageFromCache();
    if (cachedLanguage) {
      return cachedLanguage;
    }

    // Lazy import to avoid circular dependency
    const { hrisApi } = await import('@/api/hris');
    const locale = await hrisApi.settings.getLanguage();

    // Cache the language for future use
    if (locale) {
      LanguageCacheService.setLanguageInCache(locale);
    }

    return locale || DEFAULT_LANGUAGE;
  } catch (error) {
    logger.error('Error getting user locale:', error);
    return LanguageCacheService.getLanguageWithFallback();
  }
}

export function clearUserLocaleCache(): void {
  LanguageCacheService.clearLanguageCache();
}
