import { cn } from '@/shared';
import { HOUR_HEIGHT } from './constants';
import { type Day } from './types';

type Props = {
  day: Day;
  idPrefix?: string;
};
export function TimeStepsColumn({ day, idPrefix }: Props) {
  const timeSteps = day.cells.map((cell) => `${cell.hour}:${cell.minute}`);

  return (
    <ul className="flex flex-col items-center">
      {timeSteps.map((step, stepIndex) => (
        <li
          key={step}
          className={cn('relative top-[-7px] text-[0.625rem] font-semibold text-dark-grey', {
            'opacity-0': !stepIndex,
          })}
          id={idPrefix ? `${idPrefix}-${step}` : step}
          style={{
            height: HOUR_HEIGHT,
          }}
        >
          {step}
        </li>
      ))}
    </ul>
  );
}
