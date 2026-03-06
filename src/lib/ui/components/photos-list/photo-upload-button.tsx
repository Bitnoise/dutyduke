'use client';

import { useRef, forwardRef } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { Button } from '@/lib/ui';
import { Icon } from '@/lib/ui/components/icon';
import { cn } from '@/shared';

type Props = Omit<React.ComponentProps<'input'>, 'type' | 'accept'>;

export const PhotoUploadButton = forwardRef<HTMLInputElement, Props>(
  ({ className, multiple = true, ...other }, ref) => {
    const tNext = useNextTranslations('ctaLabels');
    const innerRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || innerRef;

    return (
      <>
        <input
          accept=".jpg, .jpeg, .png"
          className="hidden"
          multiple={multiple}
          ref={inputRef}
          type="file"
          {...other}
        />
        <div
          aria-label={tNext('addPhotos')}
          className={cn(
            'relative flex size-16 items-center justify-center rounded border border-grey bg-super-light-blue',
            className,
          )}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
        >
          <Icon className="text-grey" name="document-text" size="sm" />
          <Button
            excludeFromTabOrder
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2"
            icon="add"
            intent="tertiary"
            size="sm"
            type="button"
          />
        </div>
      </>
    );
  },
);

PhotoUploadButton.displayName = 'PhotoUploadButton';
