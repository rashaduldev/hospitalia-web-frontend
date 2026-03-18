"use client";

import Link from "next/link";
import { Label } from "../ui/label";
import ThemeToggle from "./theme-toggle";
import DashboardLogo from "@/public/icons/dashLogo";

const Sections = [
  {
    title: "Services",
    links: [
      { title: "Find a Doctor", href: "/search" },
      { title: "Book Appointment", href: "/patient/login" },
      { title: "Health Packages", href: "#packages" },
      { title: "Emergency Care", href: "#" },
      { title: "Teleconsultation", href: "#" },
    ],
  },
  {
    title: "Providers",
    links: [
      { title: "Doctor / Secretary Login", href: "/login" },
      { title: "Hospital Login", href: "/hospital/login" },
      { title: "Admin Login", href: "/admin/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About Us", href: "#" },
      { title: "Our Doctors", href: "/search" },
      { title: "Careers", href: "#" },
      { title: "Blog", href: "#" },
      { title: "Contact Us", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "#" },
      { title: "Terms of Service", href: "#" },
      { title: "Cookie Policy", href: "#" },
      { title: "Accessibility", href: "#" },
    ],
  },
];

const FooterSection = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-14 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 w-full mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4 min-w-56">
            <DashboardLogo className="text-white" />
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Connecting patients with trusted healthcare professionals for better, faster, and accessible care.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-secondary"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              All systems operational
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
            <Label className="text-gray-400 font-medium">Preferences</Label>
            <ThemeToggle />
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Hospitalia. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with care by{" "}
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
