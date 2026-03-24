import { Speciality } from "./speciality.type";

export type SingleDoctorInfo = {
  userId: number;
  doctorId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  mobileNumber?: string;
  countryCode?: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth?: string;
  profileImage?: string;
  verified?: boolean;
  medicalLicenseNumber?: string;
  licenseIssuingAuthority?: string;
  licenseExpiryDate?: string | number[];
  yearsOfExperience?: number;
  qualification?: string;
  professionalInfoResponse: {
    designation: string;
    onmsRegistrationNumber: string;
    professionalStatement: string;
    workPhoneNumber: string;
    fileObjectId: string | null;
    departments: any | null;
    specialities: Speciality[];
  };
};

export type UpdateDoctorProfileRequest = {
  userId: number;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  email: string;
  password?: string;
  countryCode?: string;
  mobileNumber?: string;
  professionalInfoRequest: {
    designation: string;
    specialityId: number[];
    workPhoneNumber: string;
    onmsRegistrationNumber: string;
    professionalStatement: string;
  };
  medicalLicenseNumber?: string;
  licenseIssuingAuthority?: string;
  licenseExpiryDate?: string;
  yearsOfExperience?: number;
  qualification?: string;
  verified?: boolean;
};
