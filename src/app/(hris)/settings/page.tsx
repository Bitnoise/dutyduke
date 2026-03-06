import { redirect } from 'next/navigation';
import { HRIS_ROUTES } from '@/shared';

export default function SettingsPage() {
  return redirect(HRIS_ROUTES.settings.general);
}
