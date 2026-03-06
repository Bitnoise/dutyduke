import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Avatar, Button } from '@/lib/ui/components';
import { AUTH_ROUTES } from '@/shared';
import { hrisApi } from '@/api/hris';

export async function LogoutButton(): Promise<JSX.Element> {
  const api = hrisApi;

  const me = await api.auth.getMe();

  const logout = async () => {
    'use server';

    (await cookies()).delete('Authorization');

    redirect(AUTH_ROUTES.signIn);
  };

  const fullName = `${me.firstName} ${me.lastName}`;

  return (
    <form noValidate action={logout} className="shrink-0">
      <Button aria-label={fullName} intent="ghost" size="sm" type="submit">
        <div className="flex items-center gap-x-2">
          <Avatar key={me.avatarId} avatarId={me.avatarId} size="sm" />
          <span className="hidden text-sm md:block">{fullName}</span>
        </div>
      </Button>
    </form>
  );
}
