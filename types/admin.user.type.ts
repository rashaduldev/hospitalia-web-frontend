export type UserRole = {
  id: number;
  roleName: string;
  roleType: string;
};

export type UserDetails = {
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
};

export type ContactInfo = {
  email?: string | null;
  countryCode?: string | null;
  mobileNumber?: string | null;
  isEmailVerified?: boolean;
  isMobileNumberVerified?: boolean;
};

export type AdminUser = {
  id: number;
  userType: string;
  email: string;
  mobileNumber?: string | null;
  isVerified?: boolean;
  isBanned?: boolean;
  isDisabled?: boolean;
  onboardingStatus?: string | null;
  onboardingStatusDescription?: string | null;
  status: string;
  statusDescription?: string | null;
  userDetails?: UserDetails | null;
  contactInfo?: ContactInfo | null;
  roles: UserRole[];
};

export type PaginatedUsers = {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export const USER_STATUSES = [
  "ACTIVE",
  "IN_ACTIVE",
  "TEMPORARY_IN_ACTIVE",
  "LOCKED",
  "TEMPORARY_LOCKED",
  "DISABLED",
  "TEMPORARY_DISABLED",
  "SUSPENDED",
  "TEMPORARY_SUSPENDED",
  "BLACKLISTED",
  "TEMPORARY_BLACKLISTED",
  "BANNED",
  "TEMPORARY_BANNED",
  "DELETED",
] as const;

export type UserStatus = (typeof USER_STATUSES)[number];
