import { useI18n } from "@/locales/client";
import { z } from "zod";

type TFunction = ReturnType<typeof useI18n>;

export const SearchFormSchema = (t: TFunction) =>
  z.object({
    searchType: z.enum(["DOCTOR", "HOSPITAL"]),
    city: z.string().optional().default("ALL"),
    searchKeyword: z.string().min(1, t("banner.searchSchema")),
  });

export type SearchFormValues = z.infer<ReturnType<typeof SearchFormSchema>>;
