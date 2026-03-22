import { Speciality } from "./speciality.type";

export type HospitalInfo = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hospitalName?: string;
  professionalInfoResponse?: {
    designation?: string | null;
    hospitalType?: string | null;
    workPhoneNumber?: string | null;
    websiteUrl?: string | null;
    numberOfBeds?: number | null;
    foundedYear?: number | null;
    onmsregistrationNumber?: string | null;
    professionalStatement?: string | null;
    about?: string | null;
    fileObjectId?: number | null;
    specialities?: Speciality[];
    departments?: any[];
  };
};
