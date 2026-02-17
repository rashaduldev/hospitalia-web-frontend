import { cookies } from "next/headers";
import { getCurrentUser } from "@/actions/user.actions";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

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
      <TooltipProvider>
           <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* <SectionCards /> */}
              {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
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
