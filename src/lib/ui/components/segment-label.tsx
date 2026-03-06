import { type PropsWithChildren } from 'react';
import { cn, type PropsWithClassName } from '@/shared';

type HtmlTags = 'legend' | 'heading' | 'heading-small';

type Props = {
  id?: string;
  as?: HtmlTags;
};

const htmlTags: Record<HtmlTags, keyof JSX.IntrinsicElements> = {
  legend: 'legend',
  heading: 'h3',
  'heading-small': 'h4',
};

export function SegmentLabel({
  id,
  as = 'legend',
  className,
  children,
}: PropsWithClassName<PropsWithChildren<Props>>): JSX.Element {
  const Tag = htmlTags[as];

  return (
    <Tag className={cn('pb-1.5 text-xs text-dark-grey', className)} id={id}>
      {children}
    </Tag>
  );
}
