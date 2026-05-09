"use client";
import Image from "next/image";
import Link from "next/link";
import { Check, CalendarCheck } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useI18n } from "@/locales/client";

export type PackageItem = {
  titleKey: string;
  listKeys: string[];
  price: string;
  image: string;
  featured?: boolean;
};

const PackageCard = ({ pkg }: { pkg: PackageItem }) => {
  const t = useI18n();

  const formattedPrice = Number(pkg.price).toLocaleString("fr-SN");
  const packageTitle = t(pkg.titleKey as any, {});
  const detailsHref = `/search?searchType=DOCTOR&searchKeyword=${encodeURIComponent(
    packageTitle,
  )}`;

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        pkg.featured
          ? "border-primary shadow-lg shadow-primary/15"
          : "border-border shadow-md"
      }`}
    >
      {/* Featured badge */}
      {pkg.featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-primary text-white text-xs font-semibold px-2.5 py-1 shadow">
            Most Popular
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          fill
          src={pkg.image}
          alt={packageTitle}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* gradient overlay so title stays readable if ever floated over */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 bg-card">
        {/* Title */}
        <h3 className="text-base font-bold text-foreground mb-3 leading-snug">
          {packageTitle}
        </h3>

        {/* Features */}
        <ul className="space-y-2 mb-5 flex-1">
          {pkg.listKeys.map((key, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-secondary/15 shrink-0">
                <Check className="w-2.5 h-2.5 text-secondary" strokeWidth={3} />
              </span>
              {t(key as any, {})}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="border-t border-border my-4" />

        {/* Price row */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Package price</p>
            <p className={`text-2xl font-extrabold leading-none ${pkg.featured ? "text-primary" : "text-foreground"}`}>
              {formattedPrice}
              <span className="text-sm font-semibold text-muted-foreground ml-1.5">CFA</span>
            </p>
          </div>
          {pkg.featured && (
            <span className="text-xs text-primary font-medium bg-primary/8 px-2 py-1 rounded-md">
              Best value
            </span>
          )}
        </div>

        {/* CTA */}
        <Button
          asChild
          className={`w-full font-semibold gap-2 ${
            pkg.featured
              ? "bg-primary hover:bg-primary/90 text-white"
              : "bg-secondary hover:bg-secondary/90 text-white"
          }`}
        >
          <Link href={detailsHref}>
            <CalendarCheck className="w-4 h-4" />
            {t("ourPackages.checkBtn")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PackageCard;
