import { BasicHeader } from '@/lib/ui/components/basic-header';
import { hrisApi } from '@/api/hris';
import { SearchInput } from '@/lib/ui';
import { Stack } from '@/lib/ui/components/stack';
import { Pagination } from '@/lib/ui/components/pagination';
import { type DictionaryEntity } from '@/shared/types/dictionary';
import { AddCategoryButton } from './_components/add-category-button';
import { DocumentCategoriesContent } from './_content';
import { DeleteCategoryButton } from './_components/delete-categories-button';

type Props = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    itemsPerPage?: string;
    dictionary?: string;
  }>;
};
export default async function Page({ searchParams }: Props) {
  const api = hrisApi;

  const params = await searchParams;
  const search = params.search || '';
  const itemsPerPage = params.itemsPerPage ? +params.itemsPerPage : undefined;
  const page = params.page ? +params.page : undefined;
  const selectedItems =
    params.dictionary === 'all' ? params.dictionary : params.dictionary?.split(',').filter(Boolean);
  const categories = await api.documents.getAllCategories(search, page, itemsPerPage);

  const entities: DictionaryEntity[] = categories.items.map((cat) => ({
    actions: [{ label: '', url: '' }],
    id: cat.id,
    name: cat.name,
  }));

  return (
    <>
      <BasicHeader>Document Categories</BasicHeader>
      <Stack className="pb-4 pt-6">
        <SearchInput className="basis-full md:max-w-[380px]" />
        {(selectedItems?.length ?? 0) > 0 ? <DeleteCategoryButton /> : <AddCategoryButton />}
      </Stack>
      <DocumentCategoriesContent entities={entities} />
      <Pagination
        nextPage={categories.nextPage}
        prevPage={categories.prevPage}
        totalPages={categories.totalPages}
      />
    </>
  );
}
