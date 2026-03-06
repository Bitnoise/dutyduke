import { type ReactNode } from 'react';
import { getTranslations as getNextTranslations } from 'next-intl/server';
import { type TranslationValues } from 'next-intl';
import { TooltipTriggerWrap } from '@/lib/ui/tooltip-trigger-wrap';

export const getTranslations = async (namespace?: string) => {
  const nextT = await getNextTranslations(namespace);
  const t = (key: string, ...args: TranslationValues[]): string | ReactNode => {
    const text = nextT(key, ...args);
    const tooltipKey = `${key}_tooltip`;

    if (nextT.has(tooltipKey)) {
      const tooltipContent = nextT(tooltipKey, ...args);
      return <TooltipTriggerWrap text={text} tooltipContent={tooltipContent} />;
    }

    return text;
  };
  return t;
};
