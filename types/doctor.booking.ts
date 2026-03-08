import { LocationOption } from "./doctor.location.type";
import { UnavailableDate } from "./doctor.unavailable";
import { UserType } from "./user.type";

export type DoctorBookingType = {
  locationOptions: { label: string; value: number }[];
  doctor: UserType;
  token: string | null;
  currentUserId?: number;
  doctorUnAvailable: UnavailableDate[];
  lang: string;
  onBookingSuccess?: (info: any) => void;
};

export type BookingClientSectionProps = {
  doctor: UserType;
  doctorLocations: Location[];
  locationOptions: LocationOption[];
  lang: string;
  token: string | null;
  currentUserId?: number;
  doctorUnAvailable: UnavailableDate[];
};

export type DoctorProfileType = {
  doctor: UserType;
  doctorLocations: Location[];
};
