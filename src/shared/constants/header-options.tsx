import { type IconNames } from '@/lib/ui/icons';
import { type ButtonIntent } from '../types';

export type HeaderAction = 'generateCV' | 'onboarding' | 'invite' | 'remove';

export type HeaderOption = {
  id: HeaderAction;
  label: string;
  intent?: ButtonIntent;
  icon?: IconNames;
};

export const HEADER_OPTIONS: HeaderOption[] = [
  {
    id: 'generateCV',
    label: 'ctaLabels.generateCv',
    intent: 'primary',
    icon: 'personal-card',
  },
  {
    id: 'onboarding',
    label: 'ctaLabels.onboarding',
    intent: 'tertiary',
    icon: 'checklist',
  },
  {
    id: 'invite',
    label: 'ctaLabels.invite',
    intent: 'tertiary',
    icon: 'feedback',
  },
  {
    id: 'remove',
    label: 'ctaLabels.remove',
    intent: 'danger',
    icon: 'trash',
  },
];
