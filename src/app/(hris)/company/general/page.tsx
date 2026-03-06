import { type Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { hrisApi } from '@/api/hris';
import { CompanyForm } from '@/app/(hris)/company/general/_forms';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'company.seo' });

  const api = hrisApi;

  const [company, defaultCompanyName] = await Promise.all([
    api.company.getCompany(),
    api.company.getDefaultCompanyName(),
  ]);

  return {
    title: t('title', { company: company?.name || defaultCompanyName }),
  };
}

export default async function CompanyGeneralPage(): Promise<JSX.Element> {
  const api = hrisApi;

  const company = await api.company.getCompany();
  const parsedCompany = {
    name: company.name,
    logo: company.logo?.id ?? null,
    logoId: company.logo?.id ?? null,
    _access: company._access,
  };

  return (
    <div className="min-h-full flex-1 rounded-lg bg-white px-4 pb-20 pt-2 md:p-6">
      <CompanyForm company={parsedCompany} />
    </div>
  );
}
