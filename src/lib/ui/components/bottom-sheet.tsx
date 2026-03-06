'use client';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { type ReactNode, type PropsWithChildren } from 'react';
import { ModalHeader } from '@/lib/ui';
import { cn } from '@/shared';

type Props = {
  isOpen: boolean;
  onClose(): void;
  onOpenChange(value: boolean): void;
  label: string | ReactNode;
};

export function BottomSheet({
  isOpen,
  onOpenChange,
  children,
  label,
  onClose,
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <ModalOverlay
      isDismissable
      className={({ isEntering, isExiting }) =>
        cn('fixed inset-0 bg-accent/10 overflow-x-hidden xl:hidden z-[120]', {
          'animate-show': isEntering,
          'animate-hide': isExiting,
        })
      }
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Modal
        className={({ isEntering, isExiting }) =>
          cn('fixed bottom-0 inset-x-0 w-screen bg-white shadow-xl px-2 pt-3.5 pb-6', {
            'animate-slide-in-bottom': isEntering,
            'animate-slide-out-bottom': isExiting,
          })
        }
        isOpen={isOpen}
      >
        <Dialog className="outline-none">
          <ModalHeader title={label} onClose={onClose} />
          {children}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
