import { redirect } from 'next/navigation';
import { HRIS_ROUTES } from '@/shared';

export default function DictionariesPage() {
  return redirect(HRIS_ROUTES.company.equipment.dictionaries.base('category'));
}
