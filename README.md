# MUI Address Autocomplete

![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/zenoo/mui-address-autocomplete/@mui/material)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/zenoo/mui-address-autocomplete/react)

A simple, straight-forward address autocomplete component for MUI.

## Demo

![](https://i.imgur.com/xT77nFw.png)

## Installation
```
npm i mui-address-autocomplete
```

## Props
```ts
interface AddressAutocompleteProps extends AutocompleteProps {
  apiKey: string;
  fields?: string[] = ['address_components', 'formatted_address'];
  label: string;
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: AddressAutocompleteValue,
    reason: AutocompleteChangeReason
  ) => void;
  value: AddressAutocompleteValue | null;
}
```

## Usage

```jsx
import AddressAutocomplete from 'mui-address-autocomplete';

<AddressAutocomplete
  apiKey="googlePlacesApiKeyHere"
  label="Address"
  fields={['geometry']} // fields will always contain address_components and formatted_address, no need to repeat them
  onChange={(_, value) => {
    console.log(value);
  }}
/>
```

All of MUI's [`<Autocomplete>`](https://mui.com/api/autocomplete/) props are supported.

## Result type

The result contains [the fields exposed by Google Places API](https://developers.google.com/maps/documentation/places/web-service/details#Place).  
In addition, a new field `components` is added to the result. It contains a more easily accessible version of the address components.  
You can use it like this:

```jsx
value.components.street_number[0].long_name
```

```ts
interface AddressAutocompleteResultComponent {
  long_name: string;
  short_name: string;
}

interface AddressAutocompleteValue extends PlaceType, google.maps.places.PlaceResult {
  components: {
    administrative_area_level_1?: AddressAutocompleteResultComponent[];
    administrative_area_level_2?: AddressAutocompleteResultComponent[];
    administrative_area_level_3?: AddressAutocompleteResultComponent[];
    administrative_area_level_4?: AddressAutocompleteResultComponent[];
    administrative_area_level_5?: AddressAutocompleteResultComponent[];
    administrative_area_level_6?: AddressAutocompleteResultComponent[];
    administrative_area_level_7?: AddressAutocompleteResultComponent[];
    archipelago?: AddressAutocompleteResultComponent[];
    colloquial_area?: AddressAutocompleteResultComponent[];
    continent?: AddressAutocompleteResultComponent[];
    country?: AddressAutocompleteResultComponent[];
    establishment?: AddressAutocompleteResultComponent[];
    finance?: AddressAutocompleteResultComponent[];
    floor?: AddressAutocompleteResultComponent[];
    food?: AddressAutocompleteResultComponent[];
    general_contractor?: AddressAutocompleteResultComponent[];
    geocode?: AddressAutocompleteResultComponent[];
    health?: AddressAutocompleteResultComponent[];
    intersection?: AddressAutocompleteResultComponent[];
    landmark?: AddressAutocompleteResultComponent[];
    locality?: AddressAutocompleteResultComponent[];
    natural_feature?: AddressAutocompleteResultComponent[];
    neighborhood?: AddressAutocompleteResultComponent[];
    place_of_worship?: AddressAutocompleteResultComponent[];
    plus_code?: AddressAutocompleteResultComponent[];
    point_of_interest?: AddressAutocompleteResultComponent[];
    political?: AddressAutocompleteResultComponent[];
    post_box?: AddressAutocompleteResultComponent[];
    postal_code?: AddressAutocompleteResultComponent[];
    postal_code_prefix?: AddressAutocompleteResultComponent[];
    postal_code_suffix?: AddressAutocompleteResultComponent[];
    postal_town?: AddressAutocompleteResultComponent[];
    premise?: AddressAutocompleteResultComponent[];
    room?: AddressAutocompleteResultComponent[];
    route?: AddressAutocompleteResultComponent[];
    street_address?: AddressAutocompleteResultComponent[];
    street_number?: AddressAutocompleteResultComponent[];
    sublocality?: AddressAutocompleteResultComponent[];
    sublocality_level_1?: AddressAutocompleteResultComponent[];
    sublocality_level_2?: AddressAutocompleteResultComponent[];
    sublocality_level_3?: AddressAutocompleteResultComponent[];
    sublocality_level_4?: AddressAutocompleteResultComponent[];
    sublocality_level_5?: AddressAutocompleteResultComponent[];
    subpremise?: AddressAutocompleteResultComponent[];
    town_square?: AddressAutocompleteResultComponent[];
  };
}
```
