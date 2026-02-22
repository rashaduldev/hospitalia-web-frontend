"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/locales/client";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/siteConfig";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useI18n();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locale = params?.locale as string;
  const currentUserType = searchParams.get("userType");

  const NAV_LINKS = [
    { href: "/", label: t("nav.home") },
    {
      href: "/login?userType=patient",
      label: t("nav.patient"),
      hidden:
        (pathname.includes("/login") || pathname.includes("/register")) &&
        currentUserType === "patient",
    },
    {
      href: "/login",
      label: t("nav.doctor"),
      hidden:
        (pathname.includes("/login") || pathname.includes("/register")) &&
        !currentUserType,
    },
  ];

  return (
    <header className="relative bg-back px-4 md:px-10 py-4 z-50">
      <div className="mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={siteConfig.logo}
            alt="Hospitalia logo"
            width={130}
            height={25}
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map(
            (link) =>
              !link.hidden && (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-primary transition"
                >
                  {link.label}
                </Link>
              ),
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-1.5 z-50"
        >
          <span
            className={`h-0.5 w-6 bg-card-foreground transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-card-foreground transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`h-0.5 w-6 bg-card-foreground transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute left-0 top-full w-full bg-background transition-all duration-300 ease-in-out
        ${isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-5 invisible"}`}
      >
        <nav className="px-6 py-6">
          <ul className="flex flex-col gap-6 text-sm font-medium">
            {NAV_LINKS.map(
              (link) =>
                !link.hidden && (
                  <li key={link.label}>
                    <Link
                      href={`/${locale}${link.href}`}
                      onClick={() => setIsOpen(false)}
                      className="block hover:text-primary transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
