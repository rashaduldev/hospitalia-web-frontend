import { getCurrentUser } from "@/actions/user.actions";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import ErrorHandle from "@/components/common/ErrorHandle";
import { getCurrentLocale } from "@/locales/server";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getCurrentLocale();
  const res = await getCurrentUser({ lang });
  if (!res) {
    return (
      <ErrorHandle
        message={res?.message || "Unauthorized access. Please log in."}
        status={res?.statusCode}
      />
    );
  }

  return (
    <div>
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" userRole={res?.userType} lang={lang} />
          <SidebarInset>
            <SiteHeader user={res} />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 md:gap-6 mx-6">
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
