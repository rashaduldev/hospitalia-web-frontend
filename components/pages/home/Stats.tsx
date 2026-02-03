"use client";
import { useI18n } from "@/locales/client";

const stats: { count: string; key: "patients" | "monthlyUsers" | "doctors" }[] = [
  { count: "100k+", key: "patients" },
  { count: "10k", key: "monthlyUsers" },
  { count: "5k", key: "doctors" },
];

const Stats = () => {
  const t = useI18n();

  return (
    <section className="max-w-191.5 mx-auto flex flex-col md:flex-row items-center pt-20 px-4 pb-4.5 gap-10 text-center justify-between">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${index !== 0 ? "md:border-l md:pl-14" : ""}`}
        >
          <h3 className="h3">{stat.count}</h3>
          <p>{t(`stats.${stat.key}`)}</p>
        </div>
      ))}
    </section>
  );
};

export default Stats;
