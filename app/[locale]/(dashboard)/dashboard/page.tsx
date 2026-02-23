import { getCurrentUser } from '@/actions/user.actions';
import Unauthorized from '@/components/common/Unauthorized';
import AdminDashboardPage from '@/components/pages/dashboard/AdminDashboardPage';
import DoctorDashboardPage from '@/components/pages/dashboard/Doctordashboard';
import HospitalDashboardPage from '@/components/pages/dashboard/HospitalDashboardPage';
import PatientDashboardPage from '@/components/pages/dashboard/PatientDashboardPage';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "Hospitalia - Dashboard",
  description:"This is the dashboard page for user. Here you can see your today's and upcoming appointments.",
};

const DaynamicDashboardPage = async () => {
    const res = await getCurrentUser();
    const role = res?.userType;
    
  // Role wise component render
  const Dashboards: Record<string, React.ReactNode> = {
    ADMIN: <AdminDashboardPage />,
    DOCTOR: <DoctorDashboardPage />,
    PATIENT: <PatientDashboardPage />,
    HOSPITAL: <HospitalDashboardPage />,
  };

  return (
    <div className="dashboard-container">
      {Dashboards[role as string] || <Unauthorized/>}
    </div>
  );
};

export default DaynamicDashboardPage;