"use client";

import { Stethoscope, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageDoctors from "./ManageDoctors";
import ManageLocations from "./ManageLocations";

export default function HospitalDashboardPage({
  hospitalUserId,
  lang,
}: {
  hospitalUserId: number;
  lang: string;
}) {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Hospital Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your doctors and locations.</p>
      </div>

      <Tabs defaultValue="doctors">
        <TabsList className="mb-6">
          <TabsTrigger value="doctors" className="gap-2">
            <Stethoscope className="w-4 h-4" />
            Manage Doctors
          </TabsTrigger>
          <TabsTrigger value="locations" className="gap-2">
            <MapPin className="w-4 h-4" />
            Manage Locations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctors">
          <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <Stethoscope className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground leading-none">Assigned Doctors</h2>
                <p className="text-xs text-muted-foreground mt-1">Doctors currently working at your hospital</p>
              </div>
            </div>
            <div className="p-6">
              <ManageDoctors hospitalUserId={hospitalUserId} lang={lang} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="locations">
          <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground leading-none">Hospital Locations</h2>
                <p className="text-xs text-muted-foreground mt-1">Branches and facilities of your hospital</p>
              </div>
            </div>
            <div className="p-6">
              <ManageLocations hospitalUserId={hospitalUserId} lang={lang} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
