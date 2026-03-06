import { type ReactNode } from 'react';
import { Tooltip } from '@/lib/ui/components/tooltip';

interface TooltipTriggerWrapProps {
  text: ReactNode;
  tooltipContent: string | ReactNode;
}

export const TooltipTriggerWrap = ({ text, tooltipContent }: TooltipTriggerWrapProps) => (
  <>
    {text}
    <Tooltip content={tooltipContent as string} />
  </>
);
