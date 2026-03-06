import { useState, useLayoutEffect } from 'react';

/**
 * Hook that measures current user viewport dimensions with throttling.
 * @returns width and height of users viewport expressed in pixels
 */
export function useGetViewportDimensions() {
  const [viewPortDims, setViewportDims] = useState({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setViewportDims({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 500);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId); // Clean up timeout when component unmounts
    };
  }, []);

  const { width, height } = viewPortDims;

  return { width, height };
}
