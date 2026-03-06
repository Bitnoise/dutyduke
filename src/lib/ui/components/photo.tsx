'use client';

import Image, { type ImageProps } from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/lib/ui/components/button';

type Props = Omit<ImageProps, 'height' | 'width' | 'fill'> &
  (
    | {
        onDelete: () => void;
        downloadLink?: never;
      }
    | {
        downloadLink: string;
        onDelete?: never;
      }
  );

export function Photo({ downloadLink, alt, onDelete, ...other }: Props) {
  const { src } = other;
  const router = useRouter();

  if (!src) return null;

  return (
    <div className="relative size-[5.5rem]">
      <Image fill alt={alt} className="size-full object-contain" {...other} />
      {downloadLink && (
        <Button
          className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2"
          icon="document-download"
          intent="tertiary"
          onClick={() => router.push(downloadLink)}
        />
      )}
      {onDelete && (
        <Button
          className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2"
          icon="trash"
          intent="tertiary"
          onClick={onDelete}
        />
      )}
    </div>
  );
}
