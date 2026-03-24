"use client";

import Link from "next/link";
import { Label } from "../ui/label";
import ThemeToggle from "./theme-toggle";
import DashboardLogo from "@/public/icons/dashLogo";
import { useI18n } from "@/locales/client";

const FooterSection = () => {
  const t = useI18n();

  const Sections = [
    {
      title: t("footer.services"),
      links: [
        { title: t("footer.findDoctor"), href: "/search" },
        { title: t("footer.bookAppointment"), href: "/patient/login" },
        { title: t("footer.healthPackages"), href: "#packages" },
        { title: t("footer.emergencyCare"), href: "#" },
        { title: t("footer.teleconsultation"), href: "#" },
      ],
    },
    {
      title: t("footer.providers"),
      links: [
        { title: t("footer.doctorLogin"), href: "/doctor/login" },
        { title: t("footer.hospitalLogin"), href: "/hospital/login" },
        { title: t("footer.adminLogin"), href: "/admin/login" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { title: t("footer.about"), href: "#" },
        { title: t("footer.ourDoctors"), href: "/search" },
        { title: t("footer.careers"), href: "#" },
        { title: t("footer.blog"), href: "#" },
        { title: t("footer.contact"), href: "#" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { title: t("footer.privacy"), href: "#" },
        { title: t("footer.terms"), href: "#" },
        { title: t("footer.cookie"), href: "#" },
        { title: t("footer.accessibility"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 pt-14 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 w-full mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4 min-w-56">
            <DashboardLogo className="text-white" />
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-secondary"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              {t("footer.status")}
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Sections.map(({ title, links }) => (
              <div key={title} className="space-y-4">
                <h6 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h6>
                <ul className="space-y-2">
                  {links.map(({ title, href }, index) => (
                    <li key={index}>
                      <Link
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                        href={href}
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Preferences Column */}
          <div className="flex flex-col gap-3 text-sm">
            <Label className="text-gray-400 font-medium">{t("footer.preferences")}</Label>
            <ThemeToggle />
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Hospitalia. {t("footer.copyright")}
          </p>
          <p className="text-xs text-gray-500">
            {t("footer.builtBy")}{" "}
            <a
              href="https://dhrubokinfotech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dhrubok Infotech Services Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
