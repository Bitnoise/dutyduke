'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Icon } from '@/lib/ui';
import { HRIS_ROUTES, type Nullable } from '@/shared';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type EquipmentListItemDto, type EquipmentAction } from '@/api/hris/resources/model/dtos';
import { Menu, MenuItem } from '@/lib/ui/components/menu';

type Props = {
  variant?: 'small' | 'default';
  actions: EquipmentAction[];
  equipments: EquipmentListItemDto[];
  status?: string;
  category?: string;
  filter?: string;
};

export function EquipmentBulkActions({
  variant = 'default',
  actions,
  equipments,
  status,
  category,
  filter,
}: Props): Nullable<JSX.Element> {
  const t = useTranslations('company.equipment');
  const router = useRouter();
  const { selectedItems } = useSelectItems('EQUIPMENT');

  if (!actions.length) return null;
  const parsedSelectedItems = Array.isArray(selectedItems) ? selectedItems.join(',') : selectedItems;
  const isAssigned = equipments?.some((eq) => parsedSelectedItems.includes(eq.id) && eq.assignee);

  if (variant === 'small') {
    return (
      <div className="flex gap-x-2.5">
        {selectedItems.length > 0 ? (
          <>
            <Menu
              trigger={
                <Button icon="context" intent="tertiary" size="sm">
                  Actions
                </Button>
              }
            >
              {actions.includes('assign') && (
                <MenuItem
                  className="flex items-center gap-x-2.5"
                  href={
                    isAssigned
                      ? HRIS_ROUTES.equipment.assignEmployee(parsedSelectedItems, category, status, filter)
                      : HRIS_ROUTES.equipment.assign(parsedSelectedItems, category, status, filter)
                  }
                >
                  <Icon name="link-individual" size="xs" />
                  <span>{t('assign')}</span>
                </MenuItem>
              )}
              {actions.includes('assign') && (
                <MenuItem
                  className="flex items-center gap-x-2.5"
                  href={HRIS_ROUTES.equipment.unassignEmployee(parsedSelectedItems, category, status, filter)}
                >
                  <Icon name="link-individual" size="xs" />
                  <span>{t('unassign')}</span>
                </MenuItem>
              )}
              {actions.includes('changeStatus') && (
                <MenuItem
                  className="flex items-center gap-x-2.5"
                  href={HRIS_ROUTES.equipment.update(parsedSelectedItems, category, status, filter)}
                >
                  <Icon name="refresh" size="xs" />
                  <span>{t('changeStatus')}</span>
                </MenuItem>
              )}
              {actions.includes('archive') && (
                <MenuItem
                  className="flex items-center gap-x-2.5 text-warning"
                  href={HRIS_ROUTES.equipment.archive(parsedSelectedItems, category, status, filter)}
                >
                  <Icon name="trash" size="xs" />
                  <span>{t('archive')}</span>
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <>
            {actions.includes('create') && (
              <Button icon="add" onClick={() => router.push(HRIS_ROUTES.equipment.create)} />
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="hidden gap-x-4 xl:flex">
      {selectedItems.length > 0 ? (
        <>
          {actions.includes('assign') && (
            <Button
              icon="link-individual"
              iconPlacement="right"
              onClick={() =>
                router.push(
                  isAssigned
                    ? HRIS_ROUTES.equipment.assignEmployee(parsedSelectedItems, category, status, filter)
                    : HRIS_ROUTES.equipment.assign(parsedSelectedItems, category, status, filter),
                )
              }
            >
              {t('assign')}
            </Button>
          )}
          {actions.includes('assign') && (
            <Button
              icon="link-individual"
              iconPlacement="right"
              onClick={() =>
                router.push(
                  HRIS_ROUTES.equipment.unassignEmployee(parsedSelectedItems, category, status, filter),
                )
              }
            >
              {t('unassign')}
            </Button>
          )}
          {actions.includes('changeStatus') && (
            <Button
              icon="refresh"
              iconPlacement="right"
              onClick={() =>
                router.push(HRIS_ROUTES.equipment.update(parsedSelectedItems, category, status, filter))
              }
            >
              {t('changeStatus')}
            </Button>
          )}
          {actions.includes('archive') && (
            <Button
              icon="trash"
              iconPlacement="right"
              intent="danger"
              onClick={() =>
                router.push(HRIS_ROUTES.equipment.archive(parsedSelectedItems, category, status, filter))
              }
            >
              {t('archive')}
            </Button>
          )}
        </>
      ) : (
        <>
          {actions.includes('create') && (
            <Button
              icon="add"
              iconPlacement="right"
              onClick={() => router.push(HRIS_ROUTES.equipment.create)}
            >
              {t('addNew')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
