import { AutocompleteProps, AutocompleteValue, ChipTypeMap } from "@mui/material";

interface ResultComponent {
  long_name: string;
  short_name: string;
}

interface ResultComponents {
  administrative_area_level_1?: ResultComponent;
  administrative_area_level_2?: ResultComponent;
  administrative_area_level_3?: ResultComponent;
  administrative_area_level_4?: ResultComponent;
  administrative_area_level_5?: ResultComponent;
  administrative_area_level_6?: ResultComponent;
  administrative_area_level_7?: ResultComponent;
  archipelago?: ResultComponent;
  colloquial_area?: ResultComponent;
  continent?: ResultComponent;
  country?: ResultComponent;
  establishment?: ResultComponent;
  finance?: ResultComponent;
  floor?: ResultComponent;
  food?: ResultComponent;
  general_contractor?: ResultComponent;
  geocode?: ResultComponent;
  health?: ResultComponent;
  intersection?: ResultComponent;
  landmark?: ResultComponent;
  locality?: ResultComponent;
  natural_feature?: ResultComponent;
  neighborhood?: ResultComponent;
  place_of_worship?: ResultComponent;
  plus_code?: ResultComponent;
  point_of_interest?: ResultComponent;
  political?: ResultComponent;
  post_box?: ResultComponent;
  postal_code?: ResultComponent;
  postal_code_prefix?: ResultComponent;
  postal_code_suffix?: ResultComponent;
  postal_town?: ResultComponent;
  premise?: ResultComponent;
  room?: ResultComponent;
  route?: ResultComponent;
  street_address?: ResultComponent;
  street_number?: ResultComponent;
  sublocality?: ResultComponent;
  sublocality_level_1?: ResultComponent;
  sublocality_level_2?: ResultComponent;
  sublocality_level_3?: ResultComponent;
  sublocality_level_4?: ResultComponent;
  sublocality_level_5?: ResultComponent;
  subpremise?: ResultComponent;
  town_square?: ResultComponent;
}

export interface AddressAutocompleteResult extends google.maps.places.PlaceResult {
  components: ResultComponents;
}