import { redirect } from 'next/navigation';
import { HRIS_ROUTES } from '@/shared';

export default async function Hris() {
  redirect(HRIS_ROUTES.employees.base);
}
