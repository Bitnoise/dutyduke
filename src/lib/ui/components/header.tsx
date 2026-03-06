import { type PropsWithChildren } from 'react';
import { cn, type PropsWithClassName } from '@/shared';
import { type Api } from '@/api/hris';
import { DutyDukeLogo } from './dutyduke-logo';

type Props = {
  api: Api;
};

export async function Header({ children, className }: PropsWithClassName<PropsWithChildren<Props>>) {
  return (
    <header
      className={cn(
        'flex h-14 items-center bg-white rounded-b-xl md:rounded-none px-4 sticky top-0 left-0 z-[60]',
        className,
      )}
    >
      <div className="flex w-full max-w-[102rem]">
        <div className="relative h-12 w-[8.5rem]">
          <DutyDukeLogo />
        </div>
        <div className="ml-auto flex items-center gap-x-4">{children}</div>
      </div>
    </header>
  );
}
