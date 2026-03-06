import { parseString } from '@/shared';

export function InfoText({ text }: { text: string }) {
  return (
    <div className="py-6 text-sm">
      <h4>{parseString(text)}</h4>
    </div>
  );
}
