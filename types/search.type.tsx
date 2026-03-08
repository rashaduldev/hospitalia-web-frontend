export type SearchFormValues = {
  searchType: "DOCTOR" | "HOSPITAL";
  searchKeyword: string;
};

export type SearchFormProps = {
  formWidth?: string;
  headingTitle?: string;
  headingSubtitle?: string;
  className?: string;
  onSubmitAction?: (data: SearchFormValues) => void;
  initialValues?: Partial<SearchFormValues>;
};

export type SearchResultIteam = {
  userId: number;
  name: string;
  designation: string;
  locationName: string[];
  specialities: string[];
};
