import { type PropsWithChildren } from 'react';
import { Card } from '@/lib/ui';

export default function EquipmentLayout({
  children,
  modals,
}: PropsWithChildren<{ modals: React.ReactNode }>) {
  return (
    <Card id="ExpandableCard">
      {modals}
      {children}
    </Card>
  );
}
