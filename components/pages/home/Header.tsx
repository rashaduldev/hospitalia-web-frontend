"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/locales/client";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/siteConfig";
import { cn } from "@/lib/utils";
import DashboardLogo from "@/public/icons/dashLogo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useI18n();
  const pathname = usePathname();

  const NAV_LINKS = [
    { href: "/", label: t("nav.home") },
    {
      href: "/patient/login",
      label: t("nav.patient"),
      hidden: pathname === "/patient/login" || pathname === "/patient/register",
    },
    {
      href: "/login",
      label: t("nav.doctor"),
      hidden: pathname === "/login" || pathname === "/register",
    },
  ];

  return (
    <header className="relative bg-back px-4 md:px-10 py-4 z-50">
      <div className="mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <DashboardLogo className="text-primary dark:text-card-foreground transition-colors duration-300" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map(
            (link) =>
              !link.hidden && (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-primary text-ghost-foreground transition"
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
          className="md:hidden flex flex-col gap-1.5 z-50 focus:outline-none"
        >
          <span
            className={cn(
              "h-0.5 w-6 bg-card-foreground transition-all duration-300",
              {
                "rotate-45 translate-y-2": isOpen,
              },
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 bg-card-foreground transition-all duration-300",
              {
                "opacity-0": isOpen,
                "opacity-100": !isOpen,
              },
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 bg-card-foreground transition-all duration-300",
              {
                "-rotate-45 -translate-y-2": isOpen,
              },
            )}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={cn(
          "md:hidden absolute left-0 top-full w-full bg-background transition-all duration-300 ease-in-out",
          {
            "opacity-100 translate-y-0 visible": isOpen,
            "opacity-0 -translate-y-5 invisible": !isOpen,
          },
        )}
      >
        <nav className="px-6 py-6 border-t">
          <ul className="flex flex-col gap-6 text-sm font-medium">
            {NAV_LINKS.map(
              (link) =>
                !link.hidden && (
                  <li key={link.label}>
                    <Link
                      href={link.href}
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
