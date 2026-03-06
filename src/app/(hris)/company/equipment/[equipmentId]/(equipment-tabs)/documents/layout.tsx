import { type PropsWithChildren } from 'react';

export default function EquipmentDocumentsLayout({
  editModal,
  children,
}: {
  editModal: React.ReactNode;
  children: PropsWithChildren<React.ReactNode>;
}): JSX.Element {
  return (
    <>
      {children}
      {editModal}
    </>
  );
}
