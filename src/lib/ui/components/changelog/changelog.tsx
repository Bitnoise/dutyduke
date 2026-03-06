import { Children, Fragment, type PropsWithChildren } from 'react';
import { cn, type PropsWithClassName } from '@/shared';

type Props = PropsWithClassName<PropsWithChildren>;

export function Changelog({ children, className }: Props) {
  const childArray = Children.toArray(children);

  return (
    <section
      aria-live="polite"
      className={cn('grid grid-cols-[auto_1fr] h-fit gap-y-4 gap-x-1', className)}
      role="region"
    >
      {Array.from({ length: childArray.length }).map((_, index) => (
        <Fragment key={index}>
          <div className="px-px pt-6 text-grey ">
            <div className="relative size-5 rounded-full border border-gray-300">
              <span
                className={cn(
                  'absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full',
                  {
                    'bg-accent': index == 0,
                    'bg-gray-300': index !== 0,
                  },
                )}
              />
            </div>
            {index !== childArray.length - 1 && (
              <div className="m-auto h-[calc(100%_+_1.25rem)] w-px bg-grey" />
            )}
          </div>
          <div>{childArray[index]}</div>
        </Fragment>
      ))}
    </section>
  );
}
