'use client';

import { useCallback, useState } from 'react';

export const useModal = <T>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<T>();

  const openModal = useCallback((payload?: T) => {
    if (payload) {
      setPayload(payload);
    }
    setIsOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, payload, openModal, closeModal, setIsOpen };
};
