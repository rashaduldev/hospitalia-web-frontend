import { globalSearch } from "@/actions/global.search";
import SearchUI from "@/components/pages/search/search-ui";

interface Props {
  searchParams: {
    keyword?: string;
    city?: string;
    type?: string;
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { keyword = "", city = "", type = "plus" } = searchParams;

  const data = keyword
    ? await globalSearch({
        lang: "en",
        searchKeyword: keyword,
      })
    : [];

  return (
    <SearchUI
      initialData={data}
      keyword={keyword}
      city={city}
      type={type}
    />
  );
}