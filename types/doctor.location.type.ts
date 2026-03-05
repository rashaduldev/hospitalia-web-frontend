import { locationSchema } from "@/schema/doctor.location.schema";
import z from "zod";

export type LocationFormValues = z.infer<typeof locationSchema>;

export type Location = {
  locationId: number;
  locationName: string;
  addressLine1: string;
  city: string;
  postalCode: number;
};
export type UpdateLocationParams = {
  lang: string;
  locationId: number;
  locationName: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  doctorUserId: number;
};

export type DoctorLocation = {
  locationId: number;
  doctorUserId: number;
  locationName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  country?: string | null;
  postalCode: string;
  latitude?: number | null;
  longitude?: number | null;
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
