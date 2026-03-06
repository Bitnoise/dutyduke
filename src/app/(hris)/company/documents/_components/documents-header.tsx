import { cn, type PropsWithClassName } from '@/shared';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { DocumentsItemMenu } from '.';

type Props = {
  title: string | React.ReactNode;
};

export async function DocumentsHeader({ className, title }: PropsWithClassName<Props>): Promise<JSX.Element> {
  return (
    <div
      className={cn(
        'bg-white flex relative gap-y-2 lg:gap-y-0 lg:flex-row lg:items-center justify-between items-center',
        className,
      )}
    >
      <BasicHeader>{title}</BasicHeader>
      <DocumentsItemMenu />
    </div>
  );
}
