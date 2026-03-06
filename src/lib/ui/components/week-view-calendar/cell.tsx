import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn } from '@/shared';
import { Icon } from '../icon';
import { HOUR_HEIGHT } from './constants';
import { type Cell as CellType } from './types';

export function Cell({
  cell,
  isLastInColumn = false,
  onCellClick,
}: {
  cell: CellType;
  isLastInColumn?: boolean;
  onCellClick?: (cell: CellType) => void;
}) {
  const t = useTranslations('weekCalendar');

  return (
    <div
      key={cell.date.toString()}
      className={cn('border-b w-full border-l border-gray-20 p-1', {
        'border-b-0': isLastInColumn,
      })}
      style={{ height: HOUR_HEIGHT }}
    >
      {onCellClick && (
        <button
          className={cn(
            'relative z-20 flex size-full flex-col items-center gap-y-1 rounded-lg border border-dashed border-[#4E927F] bg-[#E0ECE8] text-[#4E927F] opacity-0 outline-none transition-opacity hover:opacity-100 focus:opacity-100',
          )}
          onClick={() => onCellClick(cell)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <>
            <span className="pt-1 text-xxs font-semibold uppercase">{t('selectDate')}</span>
            <Icon name="add" size="xs" />
          </>
        </button>
      )}
    </div>
  );
}
