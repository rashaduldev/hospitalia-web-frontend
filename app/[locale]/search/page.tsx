import { globalSearch } from "@/actions/global.search";
import { Typography } from "@/components/ui/Typography";
import Header from "@/components/pages/home/Header";
import Link from "next/link";
import { getCurrentLocale } from "@/locales/server";
import Pagination from "@/components/common/Pagination";
import SearchForm from "@/components/pages/home/SearchForm";
import { SearchResultIteam } from "@/types/search.type";

export const metadata = { title: "Hospitalia - Search" };

const SearchPage = async ({ searchParams }: { searchParams: Promise<any> }) => {
  const lang = await getCurrentLocale();
  const sParams = await searchParams;

  const searchKeyword = sParams.searchKeyword || "";
  const searchType = sParams.searchType || "DOCTOR";
  const city = sParams.city || "ALL";

  const response = await globalSearch({
    lang,
    searchType,
    searchKeyword,
    city,
  });

  const SearchResultData = response?.payload?.content || [];

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="bg-popover rounded-sm">
          <SearchForm
            headingTitle="Get Appointment"
            headingSubtitle="Nice to see you again!"
            className="w-full!"
            initialValues={{ searchKeyword, searchType, city }}
          />
        </div>

        <main className="p-8 mt-8 rounded-sm bg-muted-foreground/5 min-h-100">
          <Typography
            as="h3"
            size="2xl"
            weight="bold"
            color="foreground"
            className="mb-6 capitalize"
          >
            {!searchKeyword
              ? "Search Results"
              : `${SearchResultData.length} ${
                  searchType.charAt(0).toUpperCase() +
                  searchType.slice(1).toLowerCase()
                }${SearchResultData.length !== 1 ? "s" : ""} Found`}
          </Typography>

          {SearchResultData.length > 0 ? (
            <div className="grid gap-4">
              {SearchResultData.map((item: SearchResultIteam) => (
                <Link
                  href={`/doctor/${item.userId}`}
                  key={item.userId}
                  className="py-4 border-b hover:bg-accent/50 transition-all block"
                >
                  <Typography size="xl" color="foreground" weight="medium">
                    {item.name}
                  </Typography>
                  <Typography size="xs" color="foreground" className="mt-1">
                    {[
                      item.specialities?.join(", "),
                      item.designation,
                      item.locationName?.join(", "),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Typography>
                </Link>
              ))}
              <Pagination
                totalRows={response?.payload?.pageable?.totalElements || 0}
                itemsPerPage={20}
              />
            </div>
          ) : (
            <div className="text-center py-20">
              <Typography size="lg" color="foreground">
                No results found.
              </Typography>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
