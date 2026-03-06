import { redirect } from 'next/navigation';
import { HRIS_ROUTES } from '@/shared';

export default function CompanyPage() {
  return redirect(HRIS_ROUTES.company.general);
}
