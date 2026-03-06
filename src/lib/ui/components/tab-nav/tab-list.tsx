'use client';

import { type Key } from 'react-aria-components';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Tab } from '@/lib/ui/components/tab-nav/tab';
import { type Tab as TabType } from '@/lib/ui/components/tab-nav/types';
import { cn, type PropsWithClassName } from '@/shared';
import { Button } from '@/lib/ui';
import { Menu, MenuItem } from '../menu';

type Props = {
  tabs: TabType[];
};

export function TabList({ tabs, className }: PropsWithClassName<Props>): JSX.Element {
  const t = useTranslations();
  const tabsRef = useRef<HTMLLIElement[]>([]);
  const router = useRouter();
  const [hiddenTabs, setHiddenTabs] = useState<TabType[]>([]);

  const updateTabs = useCallback(() => {
    const hiddenTabsArr: TabType[] = [];

    for (const ref of tabsRef.current) {
      if (ref.offsetTop > 0) {
        const currentTab = tabs.find((tab) => tab.id === ref.id);
        const isHidden = hiddenTabsArr.some((tab) => tab.id === ref.id);

        const link = ref.children[0] as HTMLAnchorElement;

        if (currentTab && !isHidden) {
          link.tabIndex = -1;
          hiddenTabsArr.push(currentTab);
        } else {
          link.tabIndex = 0;
        }
      }
    }

    setHiddenTabs(hiddenTabsArr);
  }, [tabs]);

  useEffect(() => {
    const card = document.getElementById('ExpandableCard');

    if (!card) return;

    const resizeObserver = new ResizeObserver(updateTabs);

    resizeObserver.observe(card);
    updateTabs();

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateTabs]);

  const handleAction = (key: Key) => {
    const href = hiddenTabs.find((tab) => tab.id === key)?.href;
    router.push(href ?? '');
  };

  const registerTab = (ref: HTMLLIElement | null) => {
    if (!ref) return;

    const isRegistered = tabsRef.current.some((tab) => tab.id === ref.id);

    if (!isRegistered) {
      tabsRef.current.push(ref);

      return;
    }
  };

  return (
    <div className={cn('flex items-center justify-between border-b border-divider', className)}>
      <ul className="flex h-[calc(3.5rem+2px)] flex-wrap items-center gap-x-1 overflow-hidden">
        {tabs.map((tab) => (
          <li key={tab.id} id={tab.id} ref={registerTab}>
            <Tab tab={tab} />
          </li>
        ))}
      </ul>
      {hiddenTabs.length > 0 && (
        <Menu
          items={hiddenTabs}
          trigger={
            <Button icon="context" intent="ghost">
              {t('ctaLabels.more')}
            </Button>
          }
          onAction={handleAction}
        >
          {(tab) => (
            <MenuItem>
              <Tab intent="menu" tab={tab} />
            </MenuItem>
          )}
        </Menu>
      )}
    </div>
  );
}
