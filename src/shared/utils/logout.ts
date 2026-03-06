'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_ROUTES } from '@/shared';

export async function logout() {
  (await cookies()).delete('Authorization');
  redirect(AUTH_ROUTES.signIn);
}
