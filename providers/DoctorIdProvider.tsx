"use client";

import { createContext, useContext } from "react";

const DoctorIdContext = createContext<number | undefined>(undefined);

export function DoctorIdProvider({
  doctorId,
  children,
}: {
  doctorId: number | undefined;
  children: React.ReactNode;
}) {
  return (
    <DoctorIdContext.Provider value={doctorId}>
      {children}
    </DoctorIdContext.Provider>
  );
}

export function useDoctorId(): number | undefined {
  return useContext(DoctorIdContext);
}
