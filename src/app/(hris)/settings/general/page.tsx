import { hrisApi } from '@/api/hris';
import { ApplicationSettingsForm } from '@/app/(hris)/settings/general/_forms';
import { DEFAULT_LANGUAGE } from '@/shared/constants/languages';
import { DEFAULT_DATE_FORMAT } from '@/shared/constants/date-formats';

// Check if we're in a build environment (no database available)
function isBuildTime(): boolean {
  return process.env.npm_lifecycle_event === 'build' || process.env.NEXT_PHASE === 'phase-production-build';
}

export default async function SettingsGeneralPage(): Promise<JSX.Element> {
  // During build, skip database queries and use default settings
  if (isBuildTime()) {
    return (
      <div className="flex flex-col gap-y-8">
        <ApplicationSettingsForm
          applicationSettings={{ language: DEFAULT_LANGUAGE, dateFormat: DEFAULT_DATE_FORMAT }}
        />
      </div>
    );
  }

  const api = hrisApi;
  const settings = await api.settings.getSettings();

  return (
    <div className="flex flex-col gap-y-8">
      <ApplicationSettingsForm
        applicationSettings={settings ?? { language: DEFAULT_LANGUAGE, dateFormat: DEFAULT_DATE_FORMAT }}
      />
    </div>
  );
}
