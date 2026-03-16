import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "../globals.css";
import AppClientProvider from "@/providers/AppClientProvider";
import AppQueryProvider from "@/providers/ReactQueryProvider";
import { getStaticParams } from "@/locales/server";
import { ThemeProvider } from "next-themes";
import { siteConfig } from "@/config/siteConfig";

const PlusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    template: "%s",
    default: "Hospitalia - Modern Healthcare Management",
  },
  description: siteConfig.description,
  keywords: [
    "Healthcare",
    "Medical Management",
    "Patient Care",
    "Hospitalia",
    "Dhrubok",
  ],
  authors: [{ name: "Dhrubok" }],
  creator: "Dhrubok",
  publisher: "Hospitalia",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: siteConfig.ogTitle,
    images: "/assets/og-image.svg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export function generateStaticParams() {
  return getStaticParams();
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body
        className={`${PlusJakartaSans.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AppClientProvider locale={locale || "en"}>
            <AppQueryProvider>{children}</AppQueryProvider>
          </AppClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
