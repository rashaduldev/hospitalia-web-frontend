"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { globalSearch } from "@/actions/global.search";
import { FormValues, SearchForm } from "@/components/pages/home/SearchForm";
import Header from "@/components/pages/home/Header";

export default function SearchPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    searchKeyword: searchParams.get("keyword") || "",
    city: searchParams.get("city") || "all",
    type: searchParams.get("type") || "doctor",
  };

  const handleSearch = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await globalSearch({
        lang,
        searchKeyword: data.searchKeyword,
        city: data.city,
        type: data.type,
      });
      setResults(response?.data || []);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialValues.searchKeyword) {
      handleSearch(initialValues as FormValues);
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto py-10">
        {/* Sidebar Search Form */}
        <aside className="w-full bg-popover px-6 py-3 rounded-sm">
          <SearchForm
            lang={lang}
            headingTitle="Get Appointment"
            headingSubtitle="Nice to see you again!"
            onSubmitProp={handleSearch}
            initialValues={initialValues}
            formWidth="w-full"
          />
        </aside>

        {/* Results Section */}
        <main className="bg-popover p-18 mt-8 rounded-sm">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <hr className="mb-6" />

          {loading ? (
            <p>Loading results...</p>
          ) : results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((item, index) => (
                <div key={index} className="p-4 border rounded shadow-sm">
                  {item.name || "Result Item"} - {item.category}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No results found for your search.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
