export type SearchFormValues = {
  searchType: "DOCTOR" | "HOSPITAL";
  searchKeyword: string;
};

export interface SearchFormProps {
  formWidth?: string;
  headingTitle?: string;
  headingSubtitle?: string;
  className?: string;
  onSubmitAction?: (data: SearchFormValues) => void;
  initialValues?: Partial<SearchFormValues>;
}
