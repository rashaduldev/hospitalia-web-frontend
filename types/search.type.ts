export type SearchFormValues = {
  searchType: "DOCTOR" | "HOSPITAL";
  city?: string;
  searchKeyword: string;
};

export type SearchFormProps = {
  formWidth?: string;
  headingTitle?: string;
  headingSubtitle?: string;
  className?: string;
  onSubmitAction?: (data: SearchFormValues) => void;
  initialValues?: Partial<SearchFormValues>;
  actionPath?: string;
};

export type SearchResultIteam = {
  userId: number;
  hospitalId?: number | null;
  name: string;
  designation: string;
  locationName: string[];
  specialities: string[];
};
