import { getCurrentUser } from "@/actions/user.actions";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getCurrentLocale } from "@/locales/server";
import { ErrorHandle } from "@/components/common/ErrorHandle";
import Unauthorized from "@/components/common/Unauthorized";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getCurrentLocale();
  const res = await getCurrentUser({ lang });

  if (!res) {
    return (
      <ErrorHandle
        message="Unauthorized access. Please log in."
        status={401}
      />
    );
  }

  if (res.userType !== "PATIENT") {
    return <Unauthorized />;
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
          <AppSidebar variant="inset" userRole="PATIENT" lang={lang} />
          <SidebarInset>
            <SiteHeader user={res} />
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
