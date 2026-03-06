import { type Nullable, type Size } from '@/shared';
import { Icon } from './icon';

type Props = {
  intent: 'critical' | 'ok' | 'warning' | null;
  size?: Size;
};

export function Badge({ intent, size }: Props): Nullable<JSX.Element> {
  switch (intent) {
    case 'critical':
      return <Icon className="text-warning" name="warning-full" size={size} />;
    case 'ok':
      return <Icon className="text-accent" name="tick-circle" size={size} />;
    case 'warning':
      return <Icon className="text-yellow" name="warning-full" size={size} />;
    default:
      return null;
  }
}
