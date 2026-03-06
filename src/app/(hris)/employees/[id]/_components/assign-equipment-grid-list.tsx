'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EquipmentListWithAccessDto } from '@/api/hris/resources/model/dtos';
import { BottomSheet, Button, GridList, GridListHeader, GridListItem } from '@/lib/ui';
import { cn, HRIS_ROUTES, parseString, type OrderBy, type PropsWithClassName } from '@/shared';
import { EquipmentBulkActions } from '@/app/(hris)/company/equipment/_components/equipment-bulk-actions';
import { useColumns, useModal } from '@/lib/ui/hooks';
import { ALL_EQUIPMENT_TABLE_COLUMNS } from '@/app/(hris)/company/equipment/_constants';
import { EquipmentFilters } from '@/app/(hris)/company/equipment/_components/equipment-filters';
import { type Item } from '@/lib/ui/components/combo-box/types';

type Props = {
  equipments: EquipmentListWithAccessDto;
  categories: Item[];
  navigationEnabled: boolean;
  assignedFiltersEnabled?: boolean;
  includeAssignee?: boolean;
};

const SORT_KEYS = [{ key: 'signature-asc' }, { key: 'signature-desc' }] as Array<{ key: OrderBy }>;

export function AssignEquipmentGridList({
  equipments,
  categories,
  className,
  navigationEnabled,
  assignedFiltersEnabled = true,
  includeAssignee = true,
}: PropsWithClassName<Props>): JSX.Element {
  const {
    items,
    _access: { columns, actions },
  } = equipments;

  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  const columnsToShow = useColumns(
    ALL_EQUIPMENT_TABLE_COLUMNS,
    includeAssignee ? columns : columns.filter((col) => col !== 'assignee'),
  );
  const t = useTranslations('company.equipment');
  const tNext = useNextTranslations('company.equipment');
  const searchParams = useSearchParams();

  const category = searchParams.get('category') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const filter = searchParams.get('filter') ?? undefined;
  return (
    <>
      <GridListHeader
        className={cn(className, 'border-b border-b-divider')}
        searchParamKey="EQUIPMENT"
        selectionMode={actions.includes('select') ? 'multiple' : undefined}
        sortKeys={SORT_KEYS}
      >
        {actions.includes('filter') && <Button icon="filter" intent="tertiary" onClick={openModal} />}
        <div className="ml-auto">
          <EquipmentBulkActions
            actions={[]}
            category={category}
            equipments={equipments.items}
            filter={filter}
            status={status}
            variant="small"
          />
        </div>
      </GridListHeader>
      <GridList
        aria-label={tNext('title')}
        className={cn(className)}
        searchParamKey={'EQUIPMENT'}
        selectionMode={actions.includes('select') ? 'multiple' : 'none'}
      >
        {items.map((equipment) => (
          <GridListItem
            key={equipment.id}
            className="border-b border-b-divider py-2"
            href={navigationEnabled ? HRIS_ROUTES.equipment.general(equipment.id) : undefined}
            id={equipment.id}
            textValue={`${equipment.signature} ${equipment.name}`}
          >
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-x-3 text-sm">
                {'signature' in columnsToShow && (
                  <span className="block max-w-[14.375rem] truncate md:max-w-[21.875rem] lg:max-w-[31.25rem]">
                    {equipment.signature}
                  </span>
                )}
                {'name' in columnsToShow && (
                  <span className="block max-w-[14.375rem] truncate md:max-w-[21.875rem] lg:max-w-[31.25rem]">
                    {equipment.name}
                  </span>
                )}
              </div>
              <div className="text-text-light-body flex gap-x-4 text-xs">
                {'category' in columnsToShow && <span>{equipment.category}</span>}
                {'status' in columnsToShow && (
                  <span>{t(`statusLabels.${equipment.status.toLowerCase()}`)}</span>
                )}
                {includeAssignee && 'assignee' in columnsToShow && equipment.assignee && (
                  <span>{parseString(equipment.assignee.fullName, '')}</span>
                )}
              </div>
            </div>
          </GridListItem>
        ))}
      </GridList>
      {categories && (
        <BottomSheet
          isOpen={isOpen}
          label={tNext('filters.title')}
          onClose={closeModal}
          onOpenChange={setIsOpen}
        >
          <EquipmentFilters assignedFiltersEnabled={assignedFiltersEnabled} categories={categories} />
        </BottomSheet>
      )}
    </>
  );
}
