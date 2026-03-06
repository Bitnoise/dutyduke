import { type Tab } from '@/lib/ui/components/tab-nav/types';
import { HRIS_ROUTES } from '@/shared/constants/routes';

export const ABSENCES_TABS: Array<Tab> = [
  {
    id: 'requests',
    label: 'requests',
    icon: 'people',
    href: HRIS_ROUTES.company.absences.base,
  },
  {
    id: 'availability',
    label: 'availability',
    icon: 'schedule',
    href: HRIS_ROUTES.company.absences.availability,
  },
  {
    id: 'ical',
    label: 'ical',
    icon: 'calendar-free',
    href: HRIS_ROUTES.company.absences.ical,
  },
  {
    id: 'settings',
    label: 'settings',
    icon: 'calendar-free',
    href: HRIS_ROUTES.company.absences.settings.base,
  },
];
