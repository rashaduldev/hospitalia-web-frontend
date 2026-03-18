"use client";

import PackageCard from "@/components/common/PackageCard";
import { PACKAGES } from "@/config/packages";
import { useI18n } from "@/locales/client";

export default function OurPackages() {
  const t = useI18n();

  return (
    <section className="py-14 md:py-24 section-container">
      <div className="mb-10">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
          Our Services
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          {t("ourPackages.title")}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PACKAGES.map((pkg, index) => (
          <PackageCard key={index} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
