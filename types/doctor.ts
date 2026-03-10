import { Speciality } from "./speciality.type";

export type SingleDoctorInfo = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE";
  profileImage?: string;
  professionalInfoResponse: {
    designation: string;
    onmsregistrationNumber: string;
    professionalStatement: string;
    workPhoneNumber: string;
    fileObjectId: string | null;
    departments: any | null;

    specialities: Speciality[];
  };
};
