'use client';

import { useEffect } from 'react';

export function usePreventAwayNavigation(isActive = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [isActive]);
}
