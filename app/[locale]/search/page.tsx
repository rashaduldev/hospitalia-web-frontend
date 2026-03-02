import { globalSearch } from "@/actions/global.search";
import { getAllHospital } from "@/actions/hospital/hospitaldata";
import { getAllDoctor } from "@/actions/doctor/doctordata";
import { Typography } from "@/components/ui/Typography";
import Header from "@/components/pages/home/Header";
import Link from "next/link";
import SearchFormWrapper from "../../../components/pages/search/SearchFormWrapper";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Search",
  description:
    "This is the Hopitalia Search Page, Here Search Doctor and Hospital name",
};

type SearchPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const lang = await getCurrentLocale();
  const sParams = await searchParams;

  const query = (sParams.query as string) || "";
  const type = (sParams.type as string) || "doctor";
  const city = (sParams.city as string) || "all";

  let results;
  if (query.trim() !== "") {
    results = await globalSearch({ lang, searchKeyword: query });
  } else if (type === "doctor") {
    results = await getAllDoctor({ lang });
  } else {
    results = await getAllHospital({ lang });
  }

  const displayData = results?.payload?.content || [];

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="w-full bg-popover px-6 py-3 rounded-sm">
          <SearchFormWrapper
            lang={lang}
            initialValues={{ searchKeyword: query, type: type as any, city }}
          />
        </div>

        <main className="p-8 mt-8 rounded-sm bg-popover min-h-100">
          <div className="flex justify-between items-center mb-4">
            <Typography as="h3" size="2xl" weight="bold" color="foreground">
              {query
                ? `Results for: ${query}`
                : `${displayData.length} ${type}s Found`}
            </Typography>
          </div>
          <hr className="mb-6" />

          {displayData.length > 0 ? (
            <div className="grid gap-4">
              {displayData.map((item: any, index: number) => {
                const title = item.firstName
                  ? `${item.firstName} ${item.lastName}`
                  : item.hospitalName || "Unnamed Result";

                const subtitle =
                  item.professionalInfoResponse?.specialities?.[0]?.name ||
                  item.category ||
                  type;

                return (
                  <Link
                    href={`/doctor/${item?.userId}`}
                    key={item.userId || index}
                    className="py-1 border-b hover:bg-accent/50 transition-colors"
                  >
                    <Typography size="xl" weight="medium" color="foreground">
                      {title}
                    </Typography>
                    <div className="flex items-center mt-1">
                      <Typography
                        size="sm"
                        color="muted_foreground"
                        className="mr-1"
                      >
                        {subtitle},
                      </Typography>
                      {item.professionalInfoResponse?.designation && (
                        <Typography size="sm" color="muted_foreground">
                          {item.professionalInfoResponse.designation}
                        </Typography>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-20">
              <Typography size="lg" weight="semiBold" color="foreground">
                No results found.
              </Typography>
              <Typography size="sm" color="foreground">
                Try adjusting your filters or search keywords.
              </Typography>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default SearchPage;
