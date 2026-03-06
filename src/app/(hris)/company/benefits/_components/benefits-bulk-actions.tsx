'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from '@/lib/ui';
import { HRIS_ROUTES, type Nullable } from '@/shared';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type BenefitListItemDto, type BenefitAction } from '@/api/hris/benefits/model/dtos';

type Props = {
  variant?: 'small' | 'default';
  actions: BenefitAction[];
  benefits: BenefitListItemDto[];
};

export function BenefitsBulkActions({
  variant = 'default',
  actions,
  benefits: _benefits,
}: Props): Nullable<JSX.Element> {
  const t = useTranslations('company.benefits');
  const router = useRouter();
  const { selectedItems } = useSelectItems('BENEFIT');

  if (!actions.length) return null;

  const hasSelectedItems = Array.isArray(selectedItems) ? selectedItems.length > 0 : Boolean(selectedItems);

  const handleAssign = () => {
    const selectedIds = Array.isArray(selectedItems) ? selectedItems : selectedItems ? [selectedItems] : [];
    const benefitIds = selectedIds.join(',');
    router.push(HRIS_ROUTES.benefits.assign(benefitIds));
  };

  const handleUnassign = () => {
    const selectedIds = Array.isArray(selectedItems) ? selectedItems : selectedItems ? [selectedItems] : [];
    console.log('Unassign selected benefits:', selectedIds);
    // TODO: Implement unassign functionality
  };

  if (variant === 'small') {
    return (
      <div className="flex gap-x-2.5">
        {hasSelectedItems ? (
          <>
            {actions.includes('assign') && (
              <Button icon="link-individual" intent="tertiary" size="sm" onClick={handleAssign}>
                {t('assign')}
              </Button>
            )}
            {actions.includes('unassign') && (
              <Button icon="link-individual" intent="tertiary" size="sm" onClick={handleUnassign}>
                {t('unassign')}
              </Button>
            )}
          </>
        ) : (
          <>
            {actions.includes('create') && (
              <Button icon="add" onClick={() => router.push(HRIS_ROUTES.benefits.create)} />
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="hidden gap-x-4 xl:flex">
      {hasSelectedItems ? (
        <>
          {actions.includes('assign') && (
            <Button icon="link-individual" iconPlacement="right" onClick={handleAssign}>
              {t('assign')}
            </Button>
          )}
          {actions.includes('unassign') && (
            <Button icon="link-individual" iconPlacement="right" onClick={handleUnassign}>
              {t('unassign')}
            </Button>
          )}
        </>
      ) : (
        <>
          {actions.includes('create') && (
            <Button icon="add" iconPlacement="right" onClick={() => router.push(HRIS_ROUTES.benefits.create)}>
              {t('addNew')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
