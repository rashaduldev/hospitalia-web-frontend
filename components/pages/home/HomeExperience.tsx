"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  HeartPulse,
  Languages,
  LockKeyhole,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PackageCard from "@/components/common/PackageCard";
import { PACKAGES } from "@/config/packages";
import { useI18n } from "@/locales/client";

const statKeys = ["stat0", "stat1", "stat2", "stat3"] as const;
const specialtyIcons = [HeartPulse, Activity, Stethoscope, ClipboardCheck, Users, ShieldCheck];
const stepIcons = [Search, CalendarCheck, MessageCircle, CheckCircle2];
const toolIcons = [Clock3, MapPin, Users, BadgeCheck, MonitorSmartphone, LockKeyhole];

export default function HomeExperience() {
  const t = useI18n();

  const quickActions = [
    { icon: Stethoscope, title: t("home.quick.item0.title"), text: t("home.quick.item0.text"), href: "/search" },
    { icon: Building2, title: t("home.quick.item1.title"), text: t("home.quick.item1.text"), href: "/search?searchType=HOSPITAL" },
    { icon: CalendarCheck, title: t("home.quick.item2.title"), text: t("home.quick.item2.text"), href: "/patient/login" },
  ];

  return (
    <main className="overflow-hidden bg-background">
      <section className="border-b bg-card py-5">
        <div className="section-container flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground md:justify-between">
          {[0, 1, 2, 3, 4].map((item) => (
            <span key={item} className="rounded-md border bg-background px-4 py-2">
              {t(`home.trust.item${item}` as any)}
            </span>
          ))}
        </div>
      </section>

      <section className="section-container py-14 md:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map(({ icon: Icon, title, text, href }, index) => (
            <Link
              key={title}
              href={href}
              className="group rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-xl font-bold leading-7 text-foreground">{title}</h2>
              <p className="leading-6">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-card py-14 md:py-20">
        <div className="section-container grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="animate-slide-in">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">{t("home.stats.label")}</p>
            <h2 className="max-w-xl text-3xl font-extrabold leading-tight text-foreground md:text-5xl">{t("home.stats.title")}</h2>
            <p className="mt-4 max-w-lg leading-7">{t("home.stats.text")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {statKeys.map((key) => (
              <div key={key} className="rounded-lg border bg-background p-5">
                <span className="block text-3xl font-extrabold text-primary md:text-4xl">
                  {t(`whyChooseUs.stats.${key}.count` as any)}
                </span>
                <span className="mt-2 block text-sm font-medium text-muted-foreground">
                  {t(`whyChooseUs.stats.${key}.des` as any)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container py-14 md:py-24">
        <SectionHeading label={t("home.specialties.label")} title={t("home.specialties.title")} text={t("home.specialties.text")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => {
            const Icon = specialtyIcons[item];
            return (
              <div key={item} className="rounded-lg border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <Icon className="mb-5 h-8 w-8 text-secondary" />
                <h3 className="mb-2 text-lg font-bold text-foreground">{t(`home.specialties.item${item}.title` as any)}</h3>
                <p className="leading-6">{t(`home.specialties.item${item}.text` as any)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white md:py-24">
        <div className="section-container grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary">{t("home.workflow.label")}</p>
            <h2 className="max-w-xl text-3xl font-extrabold leading-tight text-white md:text-5xl">{t("home.workflow.title")}</h2>
            <p className="mt-5 max-w-lg text-white/70">{t("home.workflow.text")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((item) => {
              const Icon = stepIcons[item];
              return (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <Icon className="mb-4 h-7 w-7 text-secondary" />
                  <h3 className="mb-2 text-lg font-bold text-white">{t(`home.workflow.step${item}.title` as any)}</h3>
                  <p className="text-sm leading-6 text-white/65">{t(`home.workflow.step${item}.text` as any)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-container grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-24">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
          <Image src="/assets/doctor_female.jpg" alt={t("home.patient.alt")} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <FeatureList label={t("home.patient.label")} title={t("home.patient.title")} text={t("home.patient.text")} baseKey="home.patient" />
      </section>

      <section className="border-y bg-card py-14 md:py-24">
        <div className="section-container grid gap-10 md:grid-cols-2 md:items-center">
          <FeatureList label={t("home.providers.label")} title={t("home.providers.title")} text={t("home.providers.text")} baseKey="home.providers" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
            <Image src="/assets/doctor_male.jpg" alt={t("home.providers.alt")} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="section-container py-14 md:py-24">
        <SectionHeading label={t("home.platform.label")} title={t("home.platform.title")} text={t("home.platform.text")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => {
            const Icon = toolIcons[item];
            return (
              <div key={item} className="rounded-lg border bg-card p-5">
                <Icon className="mb-4 h-6 w-6 text-primary" />
                <h3 className="mb-2 text-base font-bold text-foreground">{t(`home.platform.item${item}.title` as any)}</h3>
                <p className="text-sm leading-6">{t(`home.platform.item${item}.text` as any)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="packages" className="border-y bg-card py-14 md:py-24">
        <div className="section-container">
          <SectionHeading label={t("ourPackages.label")} title={t("ourPackages.title")} text={t("home.packages.text")} />
          <div className="grid gap-6 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.titleKey} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-container grid gap-10 py-14 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-24">
        <FeatureList label={t("home.telehealth.label")} title={t("home.telehealth.title")} text={t("home.telehealth.text")} baseKey="home.telehealth" icon={Video} />
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-lg border bg-card p-5">
              <Languages className="mb-4 h-6 w-6 text-secondary" />
              <h3 className="mb-2 text-base font-bold text-foreground">{t(`home.access.item${item}.title` as any)}</h3>
              <p className="text-sm leading-6">{t(`home.access.item${item}.text` as any)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-14 md:py-24">
        <div className="section-container grid gap-8 text-white lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/70">{t("home.security.label")}</p>
            <h2 className="text-3xl font-extrabold leading-tight text-white md:text-5xl">{t("home.security.title")}</h2>
            <p className="mt-4 max-w-lg text-white/70">{t("home.security.text")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
                <ShieldCheck className="mb-4 h-7 w-7 text-secondary" />
                <h3 className="mb-2 text-base font-bold text-white">{t(`home.security.item${item}.title` as any)}</h3>
                <p className="text-sm leading-6 text-white/70">{t(`home.security.item${item}.text` as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container py-14 md:py-24">
        <SectionHeading label={t("home.testimonials.label")} title={t("home.testimonials.title")} text={t("home.testimonials.text")} />
        <div className="grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <article key={item} className="rounded-lg border bg-card p-6 shadow-sm">
              <Sparkles className="mb-5 h-6 w-6 text-secondary" />
              <p className="mb-6 leading-7 text-foreground">{t(`home.testimonials.item${item}.quote` as any)}</p>
              <h3 className="text-base font-bold text-foreground">{t(`home.testimonials.item${item}.name` as any)}</h3>
              <p className="text-sm">{t(`home.testimonials.item${item}.role` as any)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-card py-14 md:py-24">
        <div className="section-container grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
          <SectionHeading label={t("home.faq.label")} title={t("home.faq.title")} text={t("home.faq.text")} compact />
          <div className="grid gap-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="rounded-lg border bg-background p-5">
                <h3 className="mb-2 text-base font-bold text-foreground">{t(`home.faq.item${item}.question` as any)}</h3>
                <p className="leading-6">{t(`home.faq.item${item}.answer` as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container py-14 md:py-24">
        <div className="grid gap-6 rounded-lg border bg-slate-950 p-7 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary">{t("home.final.label")}</p>
            <h2 className="max-w-3xl text-3xl font-extrabold leading-tight text-white md:text-5xl">{t("home.final.title")}</h2>
            <p className="mt-4 max-w-2xl text-white/70">{t("home.final.text")}</p>
          </div>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href="/search">
              {t("home.final.button")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  label,
  title,
  text,
  compact = false,
}: {
  label: string;
  title: string;
  text: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "mx-auto mb-10 max-w-3xl text-center"}>
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">{label}</p>
      <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">{title}</h2>
      <p className="mt-4 leading-7">{text}</p>
    </div>
  );
}

function FeatureList({
  label,
  title,
  text,
  baseKey,
  icon: Icon = CheckCircle2,
}: {
  label: string;
  title: string;
  text: string;
  baseKey: string;
  icon?: typeof CheckCircle2;
}) {
  const t = useI18n();

  return (
    <div>
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">{label}</p>
      <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-xl leading-7">{text}</p>
      <div className="mt-7 grid gap-3">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="flex gap-3 rounded-lg border bg-card p-4">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
            <span className="text-sm font-semibold leading-6 text-foreground">
              {t(`${baseKey}.point${item}` as any)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
