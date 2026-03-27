"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { LocationPickerItem, SecretaryPermission, ALL_SECRETARY_PERMISSIONS } from "@/types/secretary.type";

interface SecretaryLocationContextValue {
  locations: LocationPickerItem[];
  selectedLocationId: number | null;
  setSelectedLocationId: (id: number) => void;
  activePermissions: SecretaryPermission[];
  doctorId: number;
  doctorUserId: number;
  secretaryId: number;
  doctorName: string;
}

export const SecretaryLocationContext =
  createContext<SecretaryLocationContextValue | null>(null);

export function SecretaryLocationProvider({
  children,
  locations,
  doctorUserId,
  secretaryId,
  doctorName,
}: {
  children: React.ReactNode;
  locations: LocationPickerItem[];
  doctorUserId: number;
  secretaryId: number;
  doctorName: string;
}) {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    locations[0]?.id ?? null,
  );

  const activeLocation = useMemo(
    () => locations.find((l) => l.id === selectedLocationId) ?? null,
    [selectedLocationId, locations],
  );

  const activePermissions = useMemo<SecretaryPermission[]>(() => {
    if (!selectedLocationId) return ALL_SECRETARY_PERMISSIONS;
    return activeLocation?.permissions ?? ALL_SECRETARY_PERMISSIONS;
  }, [selectedLocationId, activeLocation]);

  const activeDoctorName = activeLocation?.doctorName ?? doctorName;
  const activeDoctorId = activeLocation?.doctorId ?? 0;

  return (
    <SecretaryLocationContext.Provider
      value={{ locations, selectedLocationId, setSelectedLocationId, activePermissions, doctorId: activeDoctorId, doctorUserId, secretaryId, doctorName: activeDoctorName }}

    >
      {children}
    </SecretaryLocationContext.Provider>
  );
}

/** Returns null when used outside the provider (e.g. SiteHeader for non-secretary users). */
export function useSecretaryLocation(): SecretaryLocationContextValue | null {
  return useContext(SecretaryLocationContext);
}
