import { type ReactNode, useCallback } from 'react';
import {
  useTranslations as useNextTranslations,
  type TranslationValues as NextIntlTranslationValues,
} from 'next-intl';
import { TooltipTriggerWrap } from '@/lib/ui/tooltip-trigger-wrap';

type RichTranslationValues = Record<string, ((chunks: ReactNode) => ReactNode) | string | number | boolean>;

type TranslationFunction = {
  (key: string, values?: NextIntlTranslationValues): string | ReactNode;
  rich: (key: string, values?: RichTranslationValues) => ReactNode;
};

const wrapWithTooltip = (text: ReactNode, tooltipContent: string | ReactNode) => (
  <TooltipTriggerWrap text={text} tooltipContent={tooltipContent} />
);

export const useTranslations = (namespace?: string): TranslationFunction => {
  const nextT = useNextTranslations(namespace);

  const handleTranslation = useCallback(
    (
      key: string,
      translate: (key: string, values?: NextIntlTranslationValues) => string | ReactNode,
      values?: NextIntlTranslationValues,
    ): string | ReactNode => {
      const text = translate(key, values);
      const tooltipKey = `${key}_tooltip`;

      if (nextT.has(tooltipKey)) {
        const tooltipContent = translate(tooltipKey, values);
        return wrapWithTooltip(text, tooltipContent);
      }

      return text;
    },
    [nextT],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const t = useCallback(
    ((key: string, values?: NextIntlTranslationValues): string | ReactNode => {
      return handleTranslation(key, nextT, values);
    }) as TranslationFunction,
    [nextT, handleTranslation],
  );

  t.rich = useCallback(
    (key: string, values?: RichTranslationValues) => {
      const nextIntlValues = values
        ? (Object.fromEntries(
            Object.entries(values).filter(([_k, _v]) => typeof _v !== 'function'),
          ) as NextIntlTranslationValues)
        : undefined;

      // Define the translation function inline to avoid dependency issues
      const translate = (k: string, _v?: NextIntlTranslationValues) => nextT.rich(k, values);
      return handleTranslation(key, translate, nextIntlValues);
    },
    [nextT, handleTranslation],
  );

  return t;
};
