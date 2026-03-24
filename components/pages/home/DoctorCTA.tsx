"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stethoscope, CalendarCheck, Users } from "lucide-react";
import { useI18n } from "@/locales/client";

const PERK_ICONS = [CalendarCheck, Users, Stethoscope];

const DoctorCTA = () => {
  const t = useI18n();

  const perks = [
    { icon: PERK_ICONS[0], text: t("doctorCta.perk0") },
    { icon: PERK_ICONS[1], text: t("doctorCta.perk1") },
    { icon: PERK_ICONS[2], text: t("doctorCta.perk2") },
  ];

  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-24">
      {/* Decorative blobs */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/5 rounded-full blur-2xl" />

      <div className="relative section-container flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-3">
            {t("doctorCta.label")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-snug mb-4">
            {t("doctorCta.title")}
            <br />
            <span className="text-secondary">{t("doctorCta.highlight")}</span>
          </h2>
          <p className="text-white/75 text-base leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
            {t("doctorCta.description")}
          </p>
          <Link href="/doctor/register">
            <Button
              size="lg"
              className="bg-white text-primary font-bold hover:bg-white/90 shadow-lg px-8"
            >
              {t("doctorCta.button")}
            </Button>
          </Link>
        </div>

        {/* Perks */}
        <div className="flex-1 flex flex-col gap-5">
          {perks.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/90 text-sm font-medium">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorCTA;
