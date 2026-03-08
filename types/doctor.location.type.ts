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
  latitude?: string;
  longitude?: string;
  country?: string;
  state?: string;
  city: string;
  postalCode: number;
};
export type UpdateLocationParams = {
  lang: string;
  locationId: number;
  locationName: string;
  addressLine1: string;
  city: string;
  postalCode: number;
  doctorUserId: number;
};
