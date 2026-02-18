"use client";

import PackageCard from "@/components/common/PackageCard";
import { PACKAGES } from "@/config/packages";
import { useI18n } from "@/locales/client";

export default function OurPackages() {
  const t = useI18n();

  return (
    <section className="py-16 section-container">
      <h2 className="text-3xl font-bold text-center mb-10">
        {t("ourPackages.title")}
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {PACKAGES.map((pkg, index) => (
          <PackageCard key={index} pkg={pkg}/>
        ))}
      </div>
    </section>
  );
}
