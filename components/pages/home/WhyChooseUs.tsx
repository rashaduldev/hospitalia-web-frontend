"use client";
import { useI18n } from "@/locales/client";

const statKeys = ["stat0", "stat1", "stat2", "stat3"] as const;

const WhyChooseUs = () => {
  const t = useI18n();

  return (
    <section className="section-container py-10 md:py-20 flex flex-col md:flex-row gap-10 justify-center">
      {/* Left content */}
      <div className="md:flex-1 text-center md:text-left">
        <h2 className="text-3xl font-semibold mb-3">
          {t("whyChooseUs.title")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto md:mx-0">
          {t("whyChooseUs.subtitle")}
        </p>
      </div>

      {/* Stats grid */}
      <div className="md:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 text-center sm:text-left">
        {statKeys.map((key, index) => (
          <div
            key={index}
            className="sm:border-l-4 border-primary px-4 sm:px-6 py-4"
          >
            <h3 className="text-3xl font-bold mb-2">
              {t(`whyChooseUs.stats.${key}.count`)}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t(`whyChooseUs.stats.${key}.des`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;