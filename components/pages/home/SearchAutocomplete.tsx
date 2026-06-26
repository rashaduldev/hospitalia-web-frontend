"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useController, Control, FieldValues, Path } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCurrentLocale } from "@/locales/client";
import { Loader2, MapPin, Stethoscope, Building2 } from "lucide-react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { globalSearch } from "@/actions/global.search";
import { SearchResultIteam } from "@/types/search.type";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: string;
  searchType: "DOCTOR" | "HOSPITAL";
  city?: string;
  placeholder?: string;
}

export function SearchAutocomplete<T extends FieldValues = FieldValues>({
  control,
  name,
  searchType,
  city,
  placeholder,
}: SearchAutocompleteProps<T>) {
  const router = useRouter();
  const lang = useCurrentLocale();
  const { field, fieldState } = useController({ control, name: name as Path<T> });

  const [suggestions, setSuggestions] = useState<SearchResultIteam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const anchorRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Fetch suggestions with debounce
  useEffect(() => {
    // Skip the first run — avoids auto-opening when the field is pre-filled
    // from initialValues (e.g. navigating to the search results page)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const keyword = (field.value ?? "").trim();

    if (keyword.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await globalSearch({ lang, searchType, searchKeyword: keyword, city });
        const items: SearchResultIteam[] = res?.payload?.content ?? [];
        setSuggestions(items.slice(0, 3));
        setOpen(items.length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [field.value, searchType, city, lang]);

  // Clear suggestions when search type changes
  useEffect(() => {
    setSuggestions([]);
    setOpen(false);
  }, [searchType]);

  const selectItem = useCallback(
    (item: SearchResultIteam) => {
      field.onChange(item.name);
      setOpen(false);
      setSuggestions([]);
      const path = searchType === "HOSPITAL" ? `/hospital/${item.hospitalId ?? item.userId}` : `/doctor/${item.doctorId ?? item.userId}`;
      router.push(path);
    },
    [field, router, searchType],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectItem(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setSuggestions([]);
      }}
    >
      <PopoverAnchor asChild>
        <div ref={anchorRef} className="relative">
          <Input
            ref={field.ref}
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={() => {
              // small delay so onMouseDown on a suggestion fires first
              setTimeout(() => setOpen(false), 150);
              field.onBlur();
            }}
            onFocus={() => {
              if (suggestions.length > 0) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            className={cn(
              "pr-8",
              fieldState.error && "border-destructive focus-visible:ring-destructive",
            )}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </PopoverAnchor>

      {fieldState.error && (
        <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
      )}

      <PopoverContent
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="p-1 gap-0"
        style={{ width: anchorRef.current ? `${anchorRef.current.offsetWidth}px` : undefined }}
      >
        {suggestions.map((item, i) => (
          <button
            key={`${item.doctorId ?? item.hospitalId ?? item.userId}-${i}`}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault(); // prevent blur closing before click
              selectItem(item);
            }}
            className={cn(
              "w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left transition-colors cursor-pointer",
              activeIndex === i ? "bg-muted" : "hover:bg-muted/60",
            )}
          >
            <div className="mt-0.5 shrink-0">
              {searchType === "DOCTOR" ? (
                <Stethoscope className="w-4 h-4 text-primary" />
              ) : (
                <Building2 className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {item.name}
              </p>
              {(item.designation || item.specialities?.length > 0) && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {[item.designation, item.specialities?.join(", ")]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              {item.locationName?.length > 0 && (
                <p className="text-xs text-muted-foreground flex items-start gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{item.locationName.join(", ")}</span>
                </p>
              )}
            </div>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
