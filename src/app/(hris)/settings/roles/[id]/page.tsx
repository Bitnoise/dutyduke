import { notFound } from 'next/navigation';
import { hrisApi } from '@/api/hris';
import { RoleEditor } from './_components/role-editor';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RoleEditPage({ params }: Props) {
  const { id } = await params;
  const api = hrisApi;

  if (id === 'create') {
    return <RoleEditor />;
  }

  const role = await api.authorization.roles.getRoleById(id);

  if (!role) {
    notFound();
  }

  return <RoleEditor initialRole={role} />;
}
