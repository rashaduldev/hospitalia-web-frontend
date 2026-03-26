export type SecretaryStatus = "PENDING" | "INVITED" | "ACTIVE";

export type SecretaryPermission =
  | "SECRETARY_DASHBOARD_READ"
  | "SECRETARY_APPOINTMENT_READ"
  | "SECRETARY_APPOINTMENT_UPDATE"
  | "SECRETARY_SCHEDULE_MANAGE"
  | "SECRETARY_PATIENT_READ"
  | "SECRETARY_LOCATION_CREATE"
  | "SECRETARY_LOCATION_UPDATE"
  | "SECRETARY_MESSAGES_MANAGE";

export const ALL_SECRETARY_PERMISSIONS: SecretaryPermission[] = [
  "SECRETARY_DASHBOARD_READ",
  "SECRETARY_APPOINTMENT_READ",
  "SECRETARY_APPOINTMENT_UPDATE",
  "SECRETARY_SCHEDULE_MANAGE",
  "SECRETARY_PATIENT_READ",
  "SECRETARY_LOCATION_CREATE",
  "SECRETARY_LOCATION_UPDATE",
  "SECRETARY_MESSAGES_MANAGE",
];

export const SECRETARY_PERMISSION_LABELS: Record<SecretaryPermission, string> = {
  SECRETARY_DASHBOARD_READ: "Dashboard",
  SECRETARY_APPOINTMENT_READ: "View Appointments",
  SECRETARY_APPOINTMENT_UPDATE: "Edit Appointments",
  SECRETARY_SCHEDULE_MANAGE: "Manage Schedule",
  SECRETARY_PATIENT_READ: "View Patients",
  SECRETARY_LOCATION_CREATE: "Create Records",
  SECRETARY_LOCATION_UPDATE: "Update Records",
  SECRETARY_MESSAGES_MANAGE: "Manage Messages",
};

export interface SecretaryResponse {
  id?: number;
  userId: number;
  status: SecretaryStatus;
  firstName: string;
  lastName?: string;
  gender: string;
  email: string;
  phoneNumber?: string;
  doctorUserId?: number;
}

export interface SecretaryLocation {
  id: number;
  userId: number;
  locationId: number;
  locationName: string;
  city?: string;
  permissions: SecretaryPermission[];
}

export interface LocationPickerItem {
  id: number;
  locationName: string;
  city?: string;
}
