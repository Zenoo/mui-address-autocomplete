import { AutocompleteProps, ChipTypeMap } from "@mui/material";
import { AddressAutocompleteResult } from "./AddressAutocompleteResult";


export interface AddressAutocompleteProps extends AutocompleteProps<AddressAutocompleteResult, false, boolean, false, ChipTypeMap['defaultComponent']> {
  apiKey: string;
  fields?: string[];
  label: string;
  value: AddressAutocompleteResult | null;
}

/**
 *
 * Demo:
 *
 * - [AddressAutocomplete](https://github.com/Zenoo/mui-address-autocomplete#usage)
 *
 * MUI's Autocmplete props:
 *
 * - [Autocomplete API](https://mui.com/api/autocomplete/)
 */
declare const AddressAutocomplete: (props: AddressAutocompleteProps) => JSX.Element;

export default AddressAutocomplete;