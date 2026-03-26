import Header from "@/components/pages/home/Header";
import SecretaryOnboardPage from "@/components/pages/secretary/SecretaryOnboardPage";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Complete Your Registration",
  description: "Set up your Hospitalia secretary account.",
};

export default async function SecretaryOnboardRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const lang = await getCurrentLocale();
  const { token = "" } = await searchParams;

  return (
    <>
      <Header />
      <div className="px-4 pt-10 pb-16">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              Secretary Registration
            </span>
            <h1 className="text-2xl font-bold text-foreground mt-3">Complete your registration</h1>
            <p className="text-sm text-muted-foreground mt-1">
              You&apos;ve been invited to join Hospitalia as a secretary. Set your password to activate your account.
            </p>
          </div>
          <SecretaryOnboardPage lang={lang} token={token} />
        </div>
      </div>
    </>
  );
}
