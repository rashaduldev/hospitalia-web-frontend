import { getCurrentUser } from '@/actions/user.actions';
import Availability from '@/components/pages/dashboard/availability/Availability';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "Hospitalia - Availability",
  description:
    "This is the availability page for user. Here you can set your availability for appointments.",
};

const AvailabilityPage = async () => {
  const res = await getCurrentUser();
  const role = res?.userType;

  // Role wise component render
  const roleComponents: Record<string, React.ReactNode> = {
    DOCTOR: <Availability user={res} />,
  };

  return (
    <div className="dashboard-container">
      {roleComponents[role as string] || <div>Unauthorized</div>}
    </div>
  );
};

export default AvailabilityPage;