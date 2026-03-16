import { StaticImageData } from "next/image";

type Role = {
  id: number;
  createdBy: string;
  lastModifiedBy: string;
  creationDate: string;
  lastModifiedDate: string;
  [key: string]: any;
};

type ContactInfo = {
  countryCode: string;
  email: string;
  id: number;
  isEmailVerified: boolean;
  isMobileNumberVerified: boolean;
  mobileNumber: string;
};

type UserDetails = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | string;
};

export type CurrentUser = {
  id: number;
  email: string;
  mobileNumber: string;
  contactInfo: ContactInfo;
  createdBy: string;
  creationDate: string;
  creationDateTimeStamp: number;
  lastModifiedBy: string;
  lastModifiedDate: string;
  lastModifiedDateTimeStamp: number;
  isBanned: boolean;
  isDisabled: boolean;
  isVerified: boolean;
  onboardingStatus: string;
  onboardingStatusDescription: string | null;
  passwordResetToken: string | null;
  roles: Role[];
  status: string;
  statusDescription: string;
  supportTicketSessionToken: string | null;
  userDetails: UserDetails;
  userType: string;
  profileImage?: string | StaticImageData;
};
