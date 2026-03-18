import Link from "next/link";
import { MapPin, Stethoscope, ArrowRight, CalendarCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SearchResultIteam } from "@/types/search.type";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function SearchResultCard({
  item,
  searchType,
}: {
  item: SearchResultIteam;
  searchType: string;
}) {
  const isDoctor = searchType !== "HOSPITAL";
  const profileHref = `/doctor/${item.userId}`;

  return (
    <div className="overflow-hidden">
      <div className="flex items-start gap-3 py-5 w-full">
        {/* Avatar */}
        <Avatar className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shrink-0 border border-border/40">
          <AvatarFallback className="rounded-full bg-primary/10 text-primary font-bold">
            {getInitials(item.name)}
          </AvatarFallback>
        </Avatar>

        {/* Info + CTAs */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 flex-1 min-w-0 overflow-hidden">

          {/* Text block */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <Link
              href={profileHref}
              className="block truncate font-bold text-gray-800 dark:text-gray-100 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>

            {item.designation && (
              <p className="line-clamp-2 text-sm text-muted-foreground mt-0.5 break-words">
                {item.designation}
              </p>
            )}

            {/* Specialities */}
            {item.specialities?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 overflow-hidden">
                <Stethoscope className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                {item.specialities.slice(0, 3).map((s, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs font-medium px-2 py-0.5 text-white max-w-[140px] truncate"
                  >
                    {s}
                  </Badge>
                ))}
                {item.specialities.length > 3 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{item.specialities.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Locations */}
            {item.locationName?.length > 0 && (
              <div className="flex items-start gap-1.5 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-secondary" />
                <span className="min-w-0 break-all">
                  {item.locationName[0]}
                  {item.locationName.length > 1 && (
                    <span className="text-xs ml-1.5">
                      +{item.locationName.length - 1} more
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2 shrink-0 sm:w-36">
            {isDoctor && (
              <Button asChild size="sm" className="gap-1.5 text-xs w-full">
                <Link href={profileHref}>
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Book Appointment
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs w-full">
              <Link href={profileHref}>
                View Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

        </div>
      </div>
      <Separator />
    </div>
  );
}
