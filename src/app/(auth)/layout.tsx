import { type PropsWithChildren } from 'react';
import { Icon } from '@/lib/ui';
import { DutyDukeLogo } from '@/lib/ui/components/dutyduke-logo';

export default function AuthLayout({ children }: PropsWithChildren): JSX.Element {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-x-8 bg-background md:grid-cols-2 md:pr-8">
      <div className="hidden flex-col items-center justify-center gap-y-16 bg-dark-accent md:flex">
        <Icon className="text-white/25" name="people" size="2xl" />
        <Icon className="text-white/25" name="building" size="2xl" />
        <Icon className="text-white/25" name="document-text" size="2xl" />
        <Icon className="text-white/25" name="feedback" size="2xl" />
      </div>
      <main className="container mx-auto flex w-full items-center justify-center px-3.5">
        <div className="w-full max-w-screen-md rounded-lg bg-white px-4 pb-14 pt-16 shadow-[0_4px_15px_0_rgba(39,55,75,0.06)] lg:px-8">
          <DutyDukeLogo />
          {children}
        </div>
      </main>
    </div>
  );
}
