"use client";
import { useI18n } from "@/locales/client";

const stats: { count: string; key: "patients" | "monthlyUsers" | "doctors"; color: string }[] = [
  { count: "100k+", key: "patients", color: "text-secondary" },
  { count: "10k", key: "monthlyUsers", color: "text-primary" },
  { count: "5k", key: "doctors", color: "text-secondary" },
];

const Stats = () => {
  const t = useI18n();

  return (
    <section className="bg-background border-b">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center py-10 px-6 gap-8 md:gap-0 text-center justify-around">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex-1 ${index !== 0 ? "md:border-l border-border" : ""} flex flex-col items-center gap-1`}
          >
            <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${stat.color}`}>
              {stat.count}
            </span>
            <span className="text-sm sm:text-base text-muted-foreground font-medium">
              {t(`stats.${stat.key}`)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
