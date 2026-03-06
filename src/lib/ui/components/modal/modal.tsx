'use client';
import { type RefAttributes, type PropsWithChildren } from 'react';
import { Dialog, ModalOverlay, type ModalOverlayProps, Modal as RAModal } from 'react-aria-components';
import { cn } from '@/shared';

export function Modal({
  children,
  className,
  isOpen,
  ...other
}: PropsWithChildren<ModalOverlayProps & RefAttributes<HTMLDivElement>>) {
  return (
    <ModalOverlay className="fixed left-0 top-0 z-[999] size-full bg-modal-overlay" isOpen={isOpen}>
      <RAModal
        className={cn(
          'w-[calc(100%_-_1rem)] outline-none md:max-w-[37.5rem] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-white shadow-modal max-h-[calc(100%_-_1rem)] overflow-y-auto',
          className,
        )}
        isOpen={isOpen}
        {...other}
      >
        <Dialog className="outline-none">{children}</Dialog>
      </RAModal>
    </ModalOverlay>
  );
}
