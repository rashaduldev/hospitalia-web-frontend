"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  totalRows: number;
  itemsPerPage?: number;
};

export default function Pagination({
  totalRows,
  itemsPerPage = 10,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalRows / itemsPerPage);

  if (totalPages <= 1) return null;

  const startRow = totalRows > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endRow = Math.min(currentPage * itemsPerPage, totalRows);

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-between px-2 py-6 mt-auto">
      {/* Left side info */}
      <div className="text-sm text-muted-foreground">
        Showing {startRow}-{endRow} of {totalRows} results
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-2">
        <Link
          href={createPageUrl(currentPage - 1)}
          className={cn(
            "flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md hover:bg-accent transition-colors",
            currentPage <= 1 && "pointer-events-none opacity-40",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isVisible =
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1);

            if (!isVisible) {
              if (page === 2 || page === totalPages - 1) {
                return (
                  <span
                    key={page}
                    className="px-1 text-muted-foreground text-xs"
                  >
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <Link
                key={page}
                href={createPageUrl(page)}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-md text-sm transition-all",
                  currentPage === page
                    ? "border border-input bg-background shadow-sm font-bold"
                    : "hover:bg-accent text-muted-foreground",
                )}
              >
                {page}
              </Link>
            );
          })}
        </div>

        <Link
          href={createPageUrl(currentPage + 1)}
          className={cn(
            "flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md hover:bg-accent transition-colors",
            currentPage >= totalPages && "pointer-events-none opacity-40",
          )}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
