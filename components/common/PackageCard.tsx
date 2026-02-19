"use client";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
    <Card className="relative mx-auto w-full pt-0 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />

      {/* Image */}
      <Image
        width={400}
        height={250}
        src={packageImage}
        alt="Package image"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />

      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>

        {/* Package Title */}
        <CardTitle>{t(pkg.titleKey as any, {})}</CardTitle>

        {/* Package Features */}
        <CardDescription>
          <ul className="space-y-2 mt-2">
            {pkg.listKeys.map((key, i) => (
              <li key={i}>✔ {t(key as any, {})}</li>
            ))}
          </ul>

          {/* Price */}
          <p className="text-xl font-bold mt-4">${pkg.price}</p>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button className="w-full">{t("ourPackages.checkBtn")}</Button>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;
