'use client';

import { type HTMLAttributes, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Modal, ModalHeader, TagGroup, Tag } from '@/lib/ui';
import { API_ROUTES, type CUID } from '@/shared';

type DownloadCvProps = HTMLAttributes<HTMLButtonElement> & {
  employeeIds: CUID[] | 'all';
  isOpen: boolean;
  onClose(): void;
};

export function DownloadCv({ employeeIds, isOpen, onClose }: DownloadCvProps) {
  const t = useTranslations();
  const [anonymousCv, setAnonymousCv] = useState(new Set(['anonymous']));
  const [isDownloading, setIsDownloading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const anonymityMode = +anonymousCv.has('anonymous') ? 1 : 0;
  const router = useRouter();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDownloadCv = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    router.push(API_ROUTES.downloadCv(employeeIds, anonymityMode));
    setIsDownloading(true);

    timeoutRef.current = setTimeout(() => {
      setIsDownloading(false);
      onClose();
      timeoutRef.current = null;
    }, 3000);
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader isDisabled={isDownloading} title={t('generateCVModal.header')} onClose={onClose} />

      <div className="my-5 flex">
        <div className="flex w-full flex-row gap-5">
          <TagGroup
            disallowEmptySelection
            defaultSelectedKeys={anonymousCv}
            tagListClassName="flex gap-x-5 cursor-pointer"
            onSelectionChange={(selection) => setAnonymousCv(selection as Set<string>)}
          >
            <Tag className="p-1 px-2" id="anonymous" size="md">
              {t('generateCVModal.anonymous')}
            </Tag>
            <Tag className="p-1 px-2" id="public" size="md">
              {t('generateCVModal.public')}
            </Tag>
          </TagGroup>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="flex flex-row gap-5 justify-self-end">
          <Button icon="close" intent="tertiary" isDisabled={isDownloading} onClick={onClose}>
            {t('ctaLabels.cancel')}
          </Button>
          <Button icon="ok" intent="primary" isLoading={isDownloading} onClick={handleDownloadCv}>
            {t('ctaLabels.generate')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
