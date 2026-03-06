import { logger } from '@/shared/service/pino';

export const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'pl', label: 'Polski' },
  { key: 'lb', label: 'Language labels' },
];

export const LANGUAGES_KEYS = LANGUAGES.map((language) => language.key);

// Get default language from environment variable, fallback to 'en' if not set
export let DEFAULT_LANGUAGE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';

// Validate that the default language is supported
if (!LANGUAGES_KEYS.includes(DEFAULT_LANGUAGE)) {
  logger.warn(`Invalid DEFAULT_LANGUAGE environment variable: ${DEFAULT_LANGUAGE}. Falling back to 'en'`);
  DEFAULT_LANGUAGE = 'en';
}

export const getLanguageLabelByKey = (key: string) =>
  LANGUAGES.find((lang) => lang.key === key)?.label ?? null;

export const getLanguageKeyByLabel = (label: string) =>
  LANGUAGES.find((lang) => lang.label === label)?.key ?? null;

export const getLanguageItemByKey = (key: string) => LANGUAGES.find((lang) => lang.key === key) ?? null;
