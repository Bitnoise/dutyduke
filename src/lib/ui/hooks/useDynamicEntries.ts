'use client';

import { useState } from 'react';

export function useDynamicEntries<T>(defaultEntries: T[] = []) {
  const [entries, setEntries] = useState<T[]>(() => defaultEntries);

  const addEntry = (entry: T) => {
    setEntries((prev) => [...prev, entry]);
  };

  const removeEntry = (entryIndex: number) => {
    setEntries((prev) => prev.filter((_, index) => index !== entryIndex));
  };

  return [entries, addEntry, removeEntry, setEntries] as [
    T[],
    typeof addEntry,
    typeof removeEntry,
    typeof setEntries,
  ];
}
