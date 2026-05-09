"use client";

import { useState } from "react";
import Link from "next/link";
import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales/client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import DashboardLogo from "@/public/icons/dashLogo";
import maleAvater from "@/public/assets/male-avater.jpg";
import feMaleAvater from "@/public/assets/female-avater.jpg";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import AppButton from "@/components/common/AppButton";
import { getCurrentUser } from "@/actions/user.actions";
import { handleLogout } from "@/actions/auth.actions";
import { Typography } from "@/components/ui/Typography";

function LanguageSwitcher() {
  const locale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  return (
    <div className="flex items-center text-sm font-medium border rounded-md overflow-hidden">
      <button
        onClick={() => changeLocale("en")}
        className={cn(
          "px-2 py-1 transition-colors",
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-ghost-foreground cursor-pointer",
        )}
      >
        EN
      </button>
      <button
        onClick={() => changeLocale("fr")}
        className={cn(
          "px-2 py-1 transition-colors",
          locale === "fr"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-ghost-foreground cursor-pointer",
        )}
      >
        FR
      </button>
    </div>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useI18n();
  const pathname = usePathname();
  const lang = useCurrentLocale();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser", lang],
    queryFn: () => getCurrentUser({ lang }),
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
    staleTime: 0,
  });

  const profileImage =
    currentUser?.profileImage ??
    (currentUser?.userDetails?.gender === "MALE" ? maleAvater : feMaleAvater);

  const DASHBOARD_BY_ROLE: Record<string, string> = {
    PATIENT: "/patient/dashboard",
    DOCTOR: "/doctor/dashboard",
    HOSPITAL: "/hospital/dashboard",
    ADMIN: "/admin/dashboard",
  };
  const dashboardUrl =
    DASHBOARD_BY_ROLE[currentUser?.userType ?? ""] ??
    (currentUser?.userType === null ? "/admin/dashboard" : "/dashboard");

  const NAV_LINKS = [
    { href: "/", label: t("nav.home") },
    {
      href: "/patient/login",
      label: t("nav.patient"),
      hidden:
        pathname === "/patient/login" ||
        pathname === "/patient/register" ||
        !!currentUser,
    },
    {
      href: "/doctor/login",
      label: t("nav.doctor"),
      hidden:
        pathname === "/doctor/login" || pathname === "/doctor/register" || !!currentUser,
    },
    {
      href: dashboardUrl,
      label: t("nav.dashboard"),
      hidden: !currentUser,
    },
  ];

  // Logout
  const logoutHandler = async () => {
    await handleLogout({ lang });
    queryClient.setQueryData(["currentUser", lang], undefined);
    queryClient.invalidateQueries({ queryKey: ["currentUser", lang] });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/92 px-4 py-3 shadow-sm backdrop-blur md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <DashboardLogo className="text-primary dark:text-card-foreground transition-colors duration-300" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
          {NAV_LINKS.map(
            (link) =>
              !link.hidden && (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-ghost-foreground transition hover:bg-primary/10 hover:text-primary"
                >
                  {link.label}
                </Link>
              ),
          )}

          <LanguageSwitcher />

          {/* User Avatar Menu */}
          {isLoading ? (
            <div className="w-9 h-9 rounded-full bg-background animate-pulse" />
          ) : (
            currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarImage
                      src={
                        typeof profileImage === "string"
                          ? profileImage
                          : profileImage.src
                      }
                      alt={currentUser?.userDetails?.firstName}
                    />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{currentUser.userType}</DropdownMenuLabel>
                  <DropdownMenuItem className="pointer-events-none font-medium">
                    {currentUser?.userDetails?.firstName}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="pointer-events-none text-xs text-muted-foreground">
                    {currentUser.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={dashboardUrl}
                      className="cursor-pointer"
                    >
                      {t("nav.dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="text-destructive cursor-pointer hover:text-destructive"
                  >
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
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
              { "rotate-45 translate-y-2": isOpen },
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 bg-card-foreground transition-all duration-300",
              { "opacity-0": isOpen, "opacity-100": !isOpen },
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 bg-card-foreground transition-all duration-300",
              { "-rotate-45 -translate-y-2": isOpen },
            )}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={cn(
          "md:hidden absolute left-0 top-full w-full bg-background shadow-xl transition-all duration-300 ease-in-out",
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

            <li>
              <LanguageSwitcher />
            </li>

            {/* Mobile User Info */}
            {isLoading ? (
              <div className="w-full h-16 bg-background animate-pulse rounded-lg" />
            ) : (
              currentUser && (
                <li>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={
                            typeof profileImage === "string"
                              ? profileImage
                              : profileImage.src
                          }
                          alt={currentUser?.userDetails?.firstName}
                        />
                      </Avatar>
                      <div className="flex flex-col">
                        <Typography weight="medium" color="foreground">
                          {currentUser?.userDetails?.firstName}
                        </Typography>
                        <Typography
                          size="xs"
                          color="muted_foreground"
                          className="my-1"
                        >
                          {currentUser.email}
                        </Typography>
                        <Typography size="xs" color="muted_foreground">
                          {currentUser.userType}
                        </Typography>
                      </div>
                    </div>
                    <Link
                      href={dashboardUrl}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("nav.dashboard")}
                    </Link>
                    <AppButton
                      variant="ghost"
                      size="sm"
                      className="text-destructive cursor-pointer hover:text-destructive! mt-2"
                      onClick={logoutHandler}
                    >
                      {t("nav.logout")}
                    </AppButton>
                  </div>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
