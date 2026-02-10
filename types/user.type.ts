import { Control } from "react-hook-form";

export interface PhoneInputProps {
  control: Control<any>;
  nameCode: string;
  mobileNumber?: string;
  phoneNumber?:string;
  label?: string;
  error?: string;
}

export type Country = {
  name: string;
  isoCode: string;
  dialCode: string; 
  flag: string;
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  payload: T | null;
  status: number;
}

export interface RegisterRequestPayload {
  firstName: string;
  lastName?: string;
  gender: "MALE" | "FEMALE";
  userType: "DOCTOR" | "HOSPITAL" | "SECRETARY";
  email?: string;
  dateOfBirth?: string;
  countryCode?: string;
  mobileNumber: string;
  password: string;

  professionalInfoRequest: {
    designation: string;
    specialityId: number[];
    departmentId: number[];
    fileObjectId: number;
    workPhoneNumber: string;
    onmsRegistrationNumber?: string;
    professionalStatement?: string;
  };
}
export interface LoginRequestPayload {
  countryCode?: string;
  phoneNumber: string;
  password: string;
}

export interface LoginResponsePayload {
  token?: string;
  refreshToken?: string;
  userId?: number;
}
