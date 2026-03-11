"use client";

import { Triangle } from "lucide-react";
import Link from "next/link";
import { Label } from "../ui/label";
import { Typography } from "../ui/Typography";
import ThemeToggle from "./theme-toggle";

const Sections = [
  {
    title: "Product",
    links: [
      { title: "Overview", href: "#" },
      { title: "Features", href: "#" },
      { title: "Solutions", href: "#" },
      { title: "Tutorials", href: "#" },
      { title: "Pricing", href: "#" },
      { title: "Releases", href: "#" },
      { title: "Analytics", href: "#" },
      { title: "Security", href: "#" },
      { title: "Integrations", href: "#" },
      { title: "Automations", href: "#" },
      { title: "Mobile App", href: "#" },
      { title: "Desktop", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About us", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Press", href: "#" },
      { title: "News", href: "#" },
      { title: "Media kit", href: "#" },
      { title: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Blog", href: "#" },
      { title: "Newsletter", href: "#" },
      { title: "Events", href: "#" },
      { title: "Help centre", href: "#" },
      { title: "Tutorials", href: "#" },
      { title: "Support", href: "#" },
    ],
  },
];

const FooterSection = () => {
  return (
    <footer className="border-t py-12 p-6 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 w-full">
          {/* Brand Column */}
          <div className="flex flex-col gap-4 min-w-50">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <Triangle className="fill-primary text-primary" size={24} />
              <span>BrandName</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} — All rights reserved.
              <Typography className="mt-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2"></span>
                </span>
                All systems normal
              </Typography>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Sections.map(({ title, links }) => (
              <div key={title} className="space-y-4">
                <h6 className="font-semibold text-foreground">{title}</h6>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {links.map(({ title, href }, index) => (
                    <li key={index}>
                      <Link
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
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
          <div className="flex flex-col gap-3 text-sm md:items-end min-w-37.5">
            <Label className="text-muted-foreground font-medium">
              Appearance
            </Label>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
