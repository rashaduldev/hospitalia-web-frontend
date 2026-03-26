export type SecretaryStatus = "PENDING" | "INVITED" | "ACTIVE";

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
  secretaryId: number;
  locationId: number;
  locationName: string;
  city?: string;
}

export interface LocationPickerItem {
  id: number;
  locationName: string;
  city?: string;
}
