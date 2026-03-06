import { notFound } from 'next/navigation';
import { hrisApi } from '@/api/hris';
import { RoleEditor } from './_components/role-editor';

type Props = {
  params: {
    id: string;
  };
};

export default async function RoleEditPage({ params }: Props) {
  const api = hrisApi;

  if (params.id === 'create') {
    return <RoleEditor />;
  }

  const role = await api.authorization.roles.getRoleById(params.id);

  if (!role) {
    notFound();
  }

  return <RoleEditor initialRole={role} />;
}
