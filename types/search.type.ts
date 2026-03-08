import { Searchschema } from "@/schema/search.schema";
import z from "zod";

export type SearchFormValues = z.infer<typeof Searchschema>;

export type SearchFormProps = {
  formWidth?: string;
  headingTitle?: string;
  headingSubtitle?: string;
  cityOptions?: { label: string; value: string }[];
  lang: string;
  className?: string;
  onSubmitAction?: (data: SearchFormValues) => void;
  initialValues?: Partial<SearchFormValues>;
};
