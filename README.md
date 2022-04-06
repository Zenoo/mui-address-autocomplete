# MUI Address Autocomplete
A simple, straight-forward address autocomplete component for MUI.

## Installation
```
npm i mui-address-autocomplete
```

## Props
```ts
interface AddressAutocompleteProps extends AutocompleteProps {
  apiKey: string;
  fields?: string[];
  label: string;
  value: AddressAutocompleteResult | null;
}
```

## Usage

```jsx
import AddressAutocomplete from 'mui-address-autocomplete';

<AddressAutocomplete
  apiKey="googlePlacesApiKeyHere"
  label="Address"
  fields={['address_components']}
  onChange={(_, value) => {
    console.log(value);
  }}
/>
```

All of MUI's [`<Autocomplete>`](https://mui.com/api/autocomplete/) props are supported.

## Demo

![](https://i.imgur.com/xT77nFw.png)
