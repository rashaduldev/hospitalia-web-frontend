import { getCurrentUser } from '@/actions/user.actions';
import ErrorHandle from '@/components/common/ErrorHandle';
import DashboardNavbar from '@/components/pages/dashboard/Navbar';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await getCurrentUser();  
  if (!res) {
    return (
      <ErrorHandle
        message={res?.message || "Unauthorized access. Please log in."} 
        status={res?.statusCode}
      />
    );
  }
  const user = res.payload;

  return (
    <div className="dashboard-wrapper">
      <DashboardNavbar user={user} />
      <main className="p-6">{children}</main>
    </div>
  );
}