import { getCurrentUser } from '@/actions/user.actions';
import AdminDashboardPage from '@/components/pages/dashboard/AdminDashboardPage';
import DoctorDashboardPage from '@/components/pages/dashboard/Doctordashboard';
import HospitalDashboardPage from '@/components/pages/dashboard/HospitalDashboardPage';
import PatientDashboardPage from '@/components/pages/dashboard/PatientDashboardPage';
import React from 'react';

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
      {Dashboards[role as string] || <div>Unauthorized</div>}
    </div>
  );
};

export default DaynamicDashboardPage;