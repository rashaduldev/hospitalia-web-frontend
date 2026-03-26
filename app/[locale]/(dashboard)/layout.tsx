import { getCurrentUser } from "@/actions/user.actions";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getCurrentLocale } from "@/locales/server";
import { ErrorHandle } from "@/components/common/ErrorHandle";
import { SecretaryLocationProvider } from "@/providers/SecretaryLocationProvider";
import { getSecretaryByUserId } from "@/actions/secretary/secretary.actions";
import { getSecretaryLocations } from "@/actions/secretary/secretaryLocations.actions";
import { getDoctorLocations } from "@/actions/doctor/location";
import { LocationPickerItem, ALL_SECRETARY_PERMISSIONS } from "@/types/secretary.type";
import { DoctorLocation } from "@/types/doctor.location.type";

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

  // ── Secretary: fetch location context data ──────────────────────────────
  let secretaryProviderProps: {
    locations: LocationPickerItem[];
    doctorId: number;
    doctorUserId: number;
    secretaryId: number;
    doctorName: string;
  } | null = null;

  if (res?.userType === "SECRETARY") {
    const secretaryRes = await getSecretaryByUserId({ userId: res.id as number, lang });
    const secretary = secretaryRes?.payload;
    const doctorUserId = secretary?.doctorUserId ?? 0;
    const doctorId: number = secretary?.doctorId ?? 0;

    let locations: LocationPickerItem[] = [];
    const locRes = await getSecretaryLocations({ userId: res.id as number, lang });
    const assigned = locRes?.payload ?? [];
    if (assigned.length > 0) {
      locations = assigned.map((l) => ({
        id: l.locationId,
        locationName: l.locationName,
        city: l.city,
        permissions: l.permissions,
        doctorId: l.doctorId,
        doctorName: l.doctorName,
      }));
    } else if (doctorId) {
      const allRes = await getDoctorLocations({ lang, doctorId });
      const allLocs: DoctorLocation[] = allRes?.payload ?? [];
      locations = allLocs.map((l) => ({
        id: l.locationId,
        locationName: l.locationName,
        city: l.city,
        permissions: ALL_SECRETARY_PERMISSIONS,
      }));
    }

    // doctorName is derived per-location in the provider from location.doctorName
    const doctorName = locations[0]?.doctorName ?? "";

    secretaryProviderProps = { locations, doctorId, doctorUserId, secretaryId: res.id as number, doctorName };
  }
  // ────────────────────────────────────────────────────────────────────────

  const ui = (
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
          <AppSidebar variant="inset" userRole={res?.userType} lang={lang} user={res} />
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

  if (secretaryProviderProps) {
    return (
      <SecretaryLocationProvider {...secretaryProviderProps}>
        {ui}
      </SecretaryLocationProvider>
    );
  }

  return ui;
}
