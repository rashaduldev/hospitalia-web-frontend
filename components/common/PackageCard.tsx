"use client";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useI18n } from "@/locales/client";
import packageImage from "../../public/assets/packages/health.png";

export type PackageItem = {
  titleKey: string;
  listKeys: string[];
  price: string;
};

const PackageCard = ({ pkg }: { pkg: PackageItem }) => {
  const t = useI18n();
  return (
    <Card className="mx-auto w-full pt-0 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-border">
      {/* Image */}
      <Image
        width={400}
        height={220}
        src={packageImage}
        alt="Package image"
        className="w-full object-cover"
        style={{ height: "180px" }}
      />

      <CardContent className="pt-5 pb-4 px-5">
        {/* Package Title */}
        <h3 className="text-lg font-bold text-primary mb-3">
          {t(pkg.titleKey as any, {})}
        </h3>

        {/* Package Features */}
        <ul className="space-y-2 mb-4">
          {pkg.listKeys.map((key, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-secondary shrink-0" />
              {t(key as any, {})}
            </li>
          ))}
        </ul>

        {/* Price */}
        <p className="text-2xl font-extrabold text-foreground">
          ${pkg.price}
          <span className="text-sm font-normal text-muted-foreground ml-1">/ package</span>
        </p>
      </CardContent>

      <CardFooter className="px-5 pb-5">
        <Button
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
        >
          {t("ourPackages.checkBtn")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;
