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
      { title: "DX Platform", href: "#" },
      { title: "Infrastructure", href: "#" },
      { title: "Storage", href: "#" },
      { title: "Analytics", href: "#" },
      { title: "Changelog", href: "#" },
      { title: "Next.js", href: "#" },
      { title: "v0", href: "#" },
      { title: "Turbo", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "CLI & API", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Docs", href: "#" },
      { title: "Pricing", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Integrations", href: "#" },
      { title: "Templates", href: "#" },
      { title: "Experts", href: "#" },
      { title: "Guides", href: "#" },
      { title: "Help", href: "#" },
      { title: "K", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Next.js Conf", href: "#" },
      { title: "Partners", href: "#" },
      { title: "Privacy Policy", href: "#" },
      { title: "Blog", href: "#" },
      { title: "Contact Us", href: "#" },
      { title: "Open Source", href: "#" },
      { title: "Security", href: "#" },
      { title: "Legal", href: "#" },
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
              <span>© {new Date().getFullYear()}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <Typography className="mt-1 flex items-center gap-2 text-foreground/60 dark:text-foreground/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-primary"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                All systems normal
              </Typography>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex-1 grid grid-cols-2 justify-between w-full sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Sections.map(({ title, links }) => (
              <div key={title} className="space-y-4">
                <h6 className="font-semibold text-foreground">{title}</h6>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {links.map(({ title, href }, index) => (
                    <li key={index}>
                      <Link
                        className="text-sm text-muted-foreground dark:text-foreground/40 transition-colors hover:text-primary"
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
          <div className="flex flex-col gap-3 text-sm min-w-37.5">
            <Label className="text-foreground font-medium">Preferences</Label>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
