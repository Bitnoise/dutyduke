'use client';

import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { useRef } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { Hamburger } from '@/lib/ui/components/navigation/hamburger';
import { cn } from '@/shared';
import { Navbar } from '@/lib/ui/components/navigation/navbar';
import { useModal } from '@/lib/ui/hooks';
import { type MeDto } from '@/api/hris/authentication/model/dtos/employee.dto';
import { type SerializedPermissions } from '@/api/hris/authorization/client';

type Props = {
  account: MeDto;
  permissions: SerializedPermissions;
};

export function MobileNavigation({ account, permissions }: Props): JSX.Element {
  const overlayRef = useRef<HTMLDivElement>(null);
  const tNext = useNextTranslations('navigation');
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();

  return (
    <>
      <Hamburger isOpen={isOpen} onPress={openModal} />
      <ModalOverlay
        isDismissable
        className={({ isEntering, isExiting }) =>
          cn('fixed inset-0 bg-modal-overlay overflow-x-hidden md:hidden z-50', {
            'animate-show': isEntering,
            'animate-hide': isExiting,
          })
        }
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Modal
          isDismissable
          className={({ isEntering, isExiting }) =>
            cn('absolute top-14 right-0 bottom-0 w-52 bg-white overflow-y-auto', {
              'animate-slide-in-horizontal': isEntering,
              'animate-slide-out-horizontal': isExiting,
            })
          }
          ref={overlayRef}
        >
          <Dialog aria-label={tNext('mobileMenu')} className="outline-none">
            <Navbar isExpanded account={account} permissions={permissions} onLinkClick={closeModal} />
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}
