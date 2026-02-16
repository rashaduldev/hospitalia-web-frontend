import { cookies } from "next/headers";
import { getCurrentUser } from "@/actions/user.actions";
import DashboardNavbar from "@/components/pages/dashboard/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("accessToken")?.value || "";
  const user = await getCurrentUser(token);

  if (!user) {
    return <div>Access denied. Please login.</div>;
  }

  return (
    <div>
      {/* <DashboardNavbar user={user} /> */}
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
