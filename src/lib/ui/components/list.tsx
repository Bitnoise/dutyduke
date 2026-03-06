import { SegmentLabel } from '@/lib/ui/components/segment-label';
import { cn, type PropsWithClassName } from '@/shared';

type Props<T extends { id: string }> = {
  label?: string;
  items: T[];
  emptyText?: string;
  children: (item: T, index: number) => React.ReactNode;
  itemClassName?: string;
} & Omit<React.ComponentProps<'ul'>, 'children'>;

export function List<T extends { id: string }>({
  items,
  emptyText,
  children,
  className,
  itemClassName,
  label,
  ...other
}: PropsWithClassName<Props<T>>) {
  return (
    <>
      {label && <SegmentLabel as="heading">{label}</SegmentLabel>}
      {items.length ? (
        <ul className={cn('flex flex-col gap-y-3.5', className)} {...other}>
          {items.map((item, index) => (
            <li key={item.id} className={cn(itemClassName)}>
              {children(item, index)}
            </li>
          ))}
        </ul>
      ) : emptyText ? (
        <p className="text-sm">{emptyText}</p>
      ) : null}
    </>
  );
}
