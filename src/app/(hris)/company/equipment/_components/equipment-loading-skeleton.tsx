import { useTranslations } from '@/shared/service/locale/use-translations';
import { Section } from '@/lib/ui';

type EquipmentSectionKey = 'basicInfo' | 'documents';

type Props = {
  sections: EquipmentSectionKey[];
};

export function EquipmentLoadingSkeleton({ sections }: Props) {
  // TODO: Add translations
  const t = useTranslations('equipmentSections');

  return (
    <div className="flex flex-col gap-y-12">
      {sections.map((section) => (
        <Section key={section} heading={t(section)}>
          <div className="min-h-56 w-full animate-pulse bg-background" />
        </Section>
      ))}
    </div>
  );
}
