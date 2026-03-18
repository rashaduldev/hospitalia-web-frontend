import { getCurrentAdminUser } from "@/actions/admin/user.actions";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminAppSidebar } from "@/components/admin/AdminAppSidebar";
import { AdminSiteHeader } from "@/components/admin/AdminSiteHeader";
import { ErrorHandle } from "@/components/common/ErrorHandle";
import Unauthorized from "@/components/common/Unauthorized";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentAdminUser();

  if (!user) {
    return (
      <ErrorHandle
        message="Unauthorized access. Please log in."
        status={401}
      />
    );
  }

  return (
    <div>
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 76)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AdminAppSidebar variant="inset" user={user} />
          <SidebarInset>
            <AdminSiteHeader user={user} />
            <div className="flex flex-1 flex-col bg-dashboard-bg">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 md:gap-6 mx-3 md:mx-6">
                  {children}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
