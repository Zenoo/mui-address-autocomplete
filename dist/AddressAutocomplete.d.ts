import { AutocompleteProps, AutocompleteRenderInputParams, ChipTypeMap } from "@mui/material";
import { AddressAutocompleteResult } from "./AddressAutocompleteResult";


interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}

export interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
  place_id?: string;
}

export interface AddressAutocompleteResultComponent {
  long_name: string;
  short_name: string;
}

export interface AddressAutocompleteValue extends PlaceType, google.maps.places.PlaceResult {
  components: Record<string, AddressAutocompleteResultComponent>;
}

export interface AddressAutocompleteProps extends Omit<
  AutocompleteProps<PlaceType, false, boolean, false, ChipTypeMap['defaultComponent']
  >, 'options' | 'renderInput'> {
  apiKey: string;
  fields?: string[];
  label: string;
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  value: AddressAutocompleteValue | null;
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