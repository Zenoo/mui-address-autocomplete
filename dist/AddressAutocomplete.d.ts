export interface AddressAutocompleteProps {
  apiKey: string;
  label: string;
  onChange: Function;
  value: object;
}

declare const AddressAutocomplete: (props: AddressAutocompleteProps) => JSX.Element;

export default AddressAutocomplete;