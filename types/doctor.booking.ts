import { DoctorLocation, LocationOption } from "./doctor.location.type";
import { UnavailableDate } from "./doctor.unavailable";
import { NewUser } from "./user.type";

export type DoctorBookingType = {
  locationOptions: { label: string; value: number }[];
  doctor: NewUser;
  token: string | null;
  currentUserId?: number;
  doctorUnAvailable: UnavailableDate[];
  lang: string;
  onBookingSuccess?: (info: any) => void;
};

export type BookingClientSectionProps = {
  doctor: NewUser;
  doctorLocations: DoctorLocation[];
  locationOptions: LocationOption[];
  lang: string;
  token: string | null;
  currentUserId?: number;
  doctorUnAvailable: UnavailableDate[];
};

export type DoctorProfileType = {
  doctor: NewUser;
  doctorLocations: DoctorLocation[];
};
