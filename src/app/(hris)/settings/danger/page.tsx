import { DeleteOrganizationForm } from '@/app/(hris)/settings/danger/_forms';

export default function SettingsDangerPage(): JSX.Element {
  return (
    <div className="flex flex-col gap-y-12">
      <DeleteOrganizationForm />
    </div>
  );
}
