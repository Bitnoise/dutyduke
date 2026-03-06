import { Icon } from '@/lib/ui/components/icon';
import { cn, type PropsWithClassName } from '@/shared';

export function Loader({ className }: PropsWithClassName): JSX.Element {
  return (
    <Icon className={cn('block size-fit animate-spin text-accent', className)} name="spinner" size="md" />
  );
}
