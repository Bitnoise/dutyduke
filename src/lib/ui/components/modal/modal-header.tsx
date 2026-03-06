'use client';

import { type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Heading } from 'react-aria-components';
import { cn } from '@/shared';
import { Button } from '../button';

type Props = {
  title: string | ReactNode;
  onClose?: () => void;
  isDisabled?: boolean;
  titleClassName?: string;
};

/**
 *
 * @param title - title that is displayed on the header of the modal
 * @param onClose - function that is called when "X" button is pressed. By default it calls `back()` method from `useRouter` hook.
 */
export function ModalHeader({ title, onClose, isDisabled, titleClassName }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <Heading className={cn('text-sm font-semibold md:text-base', titleClassName)} slot="title">
        {title}
      </Heading>
      <Button
        className="text-accent"
        icon="close"
        intent="ghost"
        isDisabled={isDisabled}
        onClick={onClose || router.back}
      />
    </div>
  );
}
