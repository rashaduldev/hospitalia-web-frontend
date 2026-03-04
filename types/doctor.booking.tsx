export type DoctorBookingType = {
  locationOptions: { label: string; value: number }[];
  doctorUserId: number;
  token: string | null;
  currentUserId: number;
  doctorUnAvailable: { unavailableDate: string }[];
  lang: string;
};
