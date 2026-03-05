import { globalSearch } from "@/actions/global.search";
import { Typography } from "@/components/ui/Typography";
import Header from "@/components/pages/home/Header";
import Link from "next/link";
import { getCurrentLocale } from "@/locales/server";
import Pagination from "@/components/common/Pagination";
import SearchForm from "@/components/pages/home/SearchForm";

export const metadata = { title: "Hospitalia - Search" };

const SearchPage = async ({ searchParams }: { searchParams: Promise<any> }) => {
  const lang = await getCurrentLocale();
  const sParams = await searchParams;

  const searchKeyword = sParams.query || "";
  const searchType = sParams.type || "DOCTOR";
  const response = await globalSearch({
    lang,
    searchType,
    searchKeyword,
  });

  const displayData = response?.payload?.content || [];

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="bg-popover px-6 py-6 rounded-sm shadow-sm">
          <SearchForm
            className="w-full!"
            initialValues={{ searchKeyword, searchType }}
          />
        </div>

        <main className="p-8 mt-8 rounded-sm bg-popover min-h-100">
          <Typography as="h3" size="2xl" weight="bold" className="mb-6">
            {searchKeyword ? `Results for: ${searchKeyword}` : "Search Results"}
          </Typography>

          {displayData.length > 0 ? (
            <div className="grid gap-4">
              {displayData.map((item: any) => (
                <Link
                  href={`/doctor/${item.userId}`}
                  key={item.userId}
                  className="p-4 border-b hover:bg-accent/50 transition-all block"
                >
                  <Typography size="xl" weight="medium">
                    {item.name}
                  </Typography>
                  <div className="flex gap-2 text-muted-foreground">
                    <span>{item.specialities?.join(", ")}</span>
                    {item.designation && <span>• {item.designation}</span>}
                  </div>
                  {item.locationName && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {item.locationName[0]}
                    </p>
                  )}
                </Link>
              ))}
              <Pagination
                totalRows={response?.payload?.pageable?.totalElements || 0}
                itemsPerPage={20}
              />
            </div>
          ) : (
            <div className="text-center py-20">
              <Typography size="lg">No results found.</Typography>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
