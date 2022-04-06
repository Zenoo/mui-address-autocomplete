import { AutocompleteProps, AutocompleteRenderInputParams, ChipTypeMap } from "@mui/material";
import { AddressAutocompleteResult } from "./AddressAutocompleteResult";


export interface AddressAutocompleteProps extends Omit<
  AutocompleteProps<AddressAutocompleteResult, false, boolean, false, ChipTypeMap['defaultComponent']
  >, 'options' | 'renderInput'> {
  apiKey: string;
  fields?: string[];
  label: string;
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
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