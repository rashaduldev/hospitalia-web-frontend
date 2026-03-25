export type DoctorAvailabilitySlot = {
  id: number;
  doctorId: number;
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  startTime: string;
  endTime: string;
  timeSlot: number;
  doctorLocationId: number;
  availabilityStatus: "AVAILABLE" | "UNAVAILABLE";
  createdBy: string;
  creationDate: string;
  creationDateTimeStamp: number;
  lastModifiedBy: string;
  lastModifiedDate: string;
  lastModifiedDateTimeStamp: number;
};
