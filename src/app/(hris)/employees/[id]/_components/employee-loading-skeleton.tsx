import { useTranslations } from '@/shared/service/locale/use-translations';
import { Section } from '@/lib/ui';

type EmployeeSectionKey =
  | 'basicInfo'
  | 'partnership'
  | 'contact'
  | 'other'
  | 'projects'
  | 'employmentHistory'
  | 'education'
  | 'courses'
  | 'documents'
  | 'earnings';

type Props = {
  sections: EmployeeSectionKey[];
};

export function EmployeeLoadingSkeleton({ sections }: Props) {
  const t = useTranslations('employeeSections');

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
