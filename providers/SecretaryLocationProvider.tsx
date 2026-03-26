"use client";

import { createContext, useContext, useState } from "react";
import { LocationPickerItem } from "@/types/secretary.type";

interface SecretaryLocationContextValue {
  locations: LocationPickerItem[];
  selectedLocationId: number | null;
  setSelectedLocationId: (id: number) => void;
  doctorId: number;
  doctorUserId: number;
  secretaryId: number;
}

export const SecretaryLocationContext =
  createContext<SecretaryLocationContextValue | null>(null);

export function SecretaryLocationProvider({
  children,
  locations,
  doctorId,
  doctorUserId,
  secretaryId,
}: {
  children: React.ReactNode;
  locations: LocationPickerItem[];
  doctorId: number;
  doctorUserId: number;
  secretaryId: number;
}) {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    locations[0]?.id ?? null,
  );

  return (
    <SecretaryLocationContext.Provider
      value={{ locations, selectedLocationId, setSelectedLocationId, doctorId, doctorUserId, secretaryId }}
    >
      {children}
    </SecretaryLocationContext.Provider>
  );
}

/** Returns null when used outside the provider (e.g. SiteHeader for non-secretary users). */
export function useSecretaryLocation(): SecretaryLocationContextValue | null {
  return useContext(SecretaryLocationContext);
}
