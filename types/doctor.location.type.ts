import { locationSchema } from "@/schema/doctor.location.schema";
import z from "zod";

export type LocationFormValues = z.infer<typeof locationSchema>;

export type LocationOption = {
  label: string;
  value: number;
};
export type Location = {
  locationId: number;
  locationName: string;
  addressLine1: string;
  addressLine2?: string;
  doctorUserId?: number;
  latitude?: number | null;
  longitude?: number | null;
  country?: string;
  state?: string;
  city: string;
  postalCode: string;
  newPatientFee?: number | null;
  oldPatientFee?: number | null;
  feeCurrency?: string | null;
  supportedAppointmentTypes?: AppointmentType[];
};

export type UpdateLocationParams = {
  lang: string;
  locationId: number;
  locationName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country?: string;
  postalCode: string;
  newPatientFee?: number;
  oldPatientFee?: number;
  feeCurrency?: string;
  supportedAppointmentTypeIds?: number[];
  doctorUserId: number;
};

export type AppointmentType = {
  id: number;
  name: string;
  description?: string;
};

export type DoctorLocation = {
  locationId: number;
  doctorUserId: number;
  locationName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country?: string;
  postalCode: string;
  latitude?: number | null;
  longitude?: number | null;
  newPatientFee?: number | null;
  oldPatientFee?: number | null;
  feeCurrency?: string | null;
  supportedAppointmentTypes?: AppointmentType[];
};

export interface DoctorUnavailability {
  id: number;
  doctorUserId: number;
  unavailableDate: string;
  createdBy: string;
  creationDate: string;
  creationDateTimeStamp: number;
  lastModifiedBy: string;
  lastModifiedDate: string;
  lastModifiedDateTimeStamp: number;
}
