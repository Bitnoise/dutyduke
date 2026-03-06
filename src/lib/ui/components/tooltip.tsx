'use client';

import { Icon } from '@/lib/ui/components/icon';

type Props = {
  content: string;
};

export function Tooltip({ content }: Props) {
  return (
    <span
      className="tooltip-icon-container relative cursor-help"
      data-tooltip-html={content}
      data-tooltip-id="app"
    >
      <Icon name="info" />
    </span>
  );
}
