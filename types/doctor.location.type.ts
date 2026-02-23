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
  locationId: number;
  locationName: string;  
  addressLine1: string;  
  city: string;
  postalCode: number;
  doctorUserId: number;
};