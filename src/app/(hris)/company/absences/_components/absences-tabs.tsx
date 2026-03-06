import { BottomTabNav, TabList } from '@/lib/ui/components/tab-nav';
import { ABSENCES_TABS } from '@/shared';

export function AbsencesTabs(): JSX.Element {
  return (
    <nav className="relative z-40">
      <BottomTabNav className="md:hidden" tabs={ABSENCES_TABS} />
      <TabList className="hidden md:flex" tabs={ABSENCES_TABS} />
    </nav>
  );
}
