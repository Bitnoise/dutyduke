import { useSetAtom } from 'jotai';
import { addToastAtom } from '@/lib/ui/components/toasts/toast.atom';

export function useToast() {
  return useSetAtom(addToastAtom);
}
