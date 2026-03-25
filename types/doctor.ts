import { Speciality } from "./speciality.type";

export type DoctorStatus = "IMPORTED" | "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type Department = {
  id: number;
  name: string;
  hospitalUserId?: number;
  createdBy?: string;
  lastModifiedBy?: string;
  creationDate?: string;
  lastModifiedDate?: string;
  creationDateTimeStamp?: number;
  lastModifiedDateTimeStamp?: number;
};

export type SingleDoctorInfo = {
  id?: number;
  userId: number;
  status?: DoctorStatus | null;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | string;
  email: string;
  phoneNumber?: string;
  verified?: boolean | null;
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
    fileObjectId?: number | null;
    departments?: Department[] | null;
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
