'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

export function useElementBoundingClientRect<T extends Element>(elementRef: RefObject<T>) {
  const [boundingClientRect, setBoundingClientRect] = useState<DOMRect>();
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      setBoundingClientRect(undefined);
      return;
    }

    // Initial measurement
    const updateRect = () => {
      if (element) {
        setBoundingClientRect(element.getBoundingClientRect());
      }
    };

    updateRect();

    // Use ResizeObserver to only update when size actually changes
    observerRef.current = new ResizeObserver(() => {
      updateRect();
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [elementRef]);

  return boundingClientRect;
}
