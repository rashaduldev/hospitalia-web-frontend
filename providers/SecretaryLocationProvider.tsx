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

const SecretaryLocationContext = createContext<SecretaryLocationContextValue | null>(null);

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

export function useSecretaryLocation(): SecretaryLocationContextValue {
  const ctx = useContext(SecretaryLocationContext);
  if (!ctx) throw new Error("useSecretaryLocation must be used inside SecretaryLocationProvider");
  return ctx;
}
