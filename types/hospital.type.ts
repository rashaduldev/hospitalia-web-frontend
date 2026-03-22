import { Speciality } from "./speciality.type";

export type HospitalInfo = {
  id: number;
  userId: number;
  hospitalName?: string | null;
  hospitalType?: string | null;
  workPhoneNumber?: string | null;
  websiteUrl?: string | null;
  numberOfBeds?: number | null;
  foundedYear?: number | null;
  professionalInfoResponse?: {
    onmsRegistrationNumber?: string | null;
    professionalStatement?: string | null;
    fileObjectId?: number | null;
    specialities?: Speciality[];
    departments?: { id: number; name: string }[];
  };
};
