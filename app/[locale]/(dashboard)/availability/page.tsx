import { getCurrentUser } from "@/actions/user.actions";
import ErrorHandle from "@/components/common/ErrorHandle";
import Unauthorized from "@/components/common/Unauthorized";
import Availability from "@/components/pages/dashboard/availability/Availability";
import { getCurrentLocale } from "@/locales/server";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Hospitalia - Availability",
  description:
    "This is the availability page for user. Here you can set your availability for appointments.",
};

const AvailabilityPage = async () => {
  const lang = await getCurrentLocale();

  const res = await getCurrentUser({lang});
  const role = res?.userType;

  if (!res) {
    return (
      <ErrorHandle message="Failed to load user information." status={401} />
    );
  }

  // Role wise component render
  const roleComponents: Record<string, React.ReactNode> = {
    DOCTOR: <Availability userId={res?.id} lang={lang} />,
  };

  return (
    <div className="dashboard-container">
      {roleComponents[role as string] || <Unauthorized />}
    </div>
  );
};

export default AvailabilityPage;
