import { Speciality } from "./speciality.type";

export type HospitalInfo = {
  id: number;
  userType: string;
  email: string;
  mobileNumber?: string;
  onboardingStatus?: string;
  userDetails?: {
    id?: number;
    firstName?: string | null;       // hospital name
    lastName?: string | null;
    hospitalType?: string | null;
    workPhoneNumber?: string | null;
    websiteUrl?: string | null;
    numberOfBeds?: number | null;
    foundedYear?: number | null;
    onmsRegistrationNumber?: string | null;
    about?: string | null;
    specialities?: Speciality[];
  };
  contactInfo?: {
    email?: string;
    countryCode?: string;
    mobileNumber?: string;
    isEmailVerified?: boolean;
    isMobileNumberVerified?: boolean;
  };
};
