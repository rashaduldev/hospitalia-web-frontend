"use client";
import { useI18n } from "@/locales/client";

const statKeys = ["stat0", "stat1", "stat2", "stat3"] as const;

const WhyChooseUs = () => {
  const t = useI18n();

  return (
    <section className="section-container py-14 md:py-24 flex flex-col md:flex-row gap-12 md:gap-16 items-start">
      {/* Left content */}
      <div className="md:flex-1 text-center md:text-left">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
          Why Choose Us
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-snug mb-4">
          {t("whyChooseUs.title")}
        </h2>
        <p className="text-base text-muted-foreground max-w-md mx-auto md:mx-0 leading-relaxed">
          {t("whyChooseUs.subtitle")}
        </p>
      </div>

      {/* Stats grid */}
      <div className="md:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {statKeys.map((key, index) => (
          <div
            key={index}
            className="border-l-4 border-primary pl-5 py-3 bg-primary/5 rounded-r-lg"
          >
            <span className="block text-3xl font-extrabold text-primary mb-1">
              {t(`whyChooseUs.stats.${key}.count`)}
            </span>
            <span className="text-sm text-muted-foreground leading-snug">
              {t(`whyChooseUs.stats.${key}.des`)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;