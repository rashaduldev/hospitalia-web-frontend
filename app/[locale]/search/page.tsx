import { globalSearch } from "@/actions/global.search";
import Header from "@/components/pages/home/Header";
import { getCurrentLocale } from "@/locales/server";
import Pagination from "@/components/common/Pagination";
import SearchForm from "@/components/pages/home/SearchForm";
import { SearchResultCard } from "@/components/pages/search/SearchResultCard";
import { SearchResultIteam } from "@/types/search.type";
import { Stethoscope, Building2, SearchX } from "lucide-react";

export const metadata = { title: "Hospitalia - Search" };

const SearchPage = async ({ searchParams }: { searchParams: Promise<any> }) => {
  const lang = await getCurrentLocale();
  const sParams = await searchParams;

  const searchKeyword = sParams.searchKeyword || "";
  const searchType = sParams.searchType || "DOCTOR";
  const city = sParams.city || "ALL";
  const pageNo = Math.max(0, Number(sParams.page || 1) - 1);

  const response = await globalSearch({
    lang,
    searchType,
    searchKeyword,
    city,
    pageNo,
  });

  const results: SearchResultIteam[] = response?.payload?.content || [];
  const total: number = response?.payload?.totalElements || 0;

  const TypeIcon = searchType === "HOSPITAL" ? Building2 : Stethoscope;
  const typeLabel = searchType === "HOSPITAL" ? "Hospital" : "Doctor";

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
        {/* Search form */}
        <div className="rounded-xl border border-border shadow-sm overflow-hidden">
          <SearchForm
            className="w-full! rounded-none! shadow-none! border-0!"
            initialValues={{ searchKeyword, searchType, city }}
          />
        </div>

        {/* Results section */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Results header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
            <TypeIcon className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-base font-bold text-foreground leading-none">
                {searchKeyword ? (
                  <>
                    {total.toLocaleString()} {typeLabel}{total !== 1 ? "s" : ""} found
                    <span className="font-normal text-muted-foreground ml-1">
                      for &ldquo;{searchKeyword}&rdquo;
                      {city !== "ALL" && ` in ${city}`}
                    </span>
                  </>
                ) : (
                  "Search Results"
                )}
              </h2>
            </div>
          </div>

          {/* Result list */}
          {results.length > 0 ? (
            <div className="px-5">
              {results.map((item) => (
                <SearchResultCard key={item.userId} item={item} searchType={searchType} />
              ))}

              <div className="py-5">
                <Pagination totalRows={total} itemsPerPage={20} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
              <SearchX className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-base font-semibold text-foreground">
                No results found
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Try a different keyword{city !== "ALL" ? ", region," : ""} or search type.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
