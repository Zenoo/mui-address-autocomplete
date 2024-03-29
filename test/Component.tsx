import React from 'react';
import { AddressAutocompleteValue } from '../dist/AddressAutocomplete';
import AddressAutocomplete from '../src/AddressAutocomplete';

const Component = () => {
  const [value, setValue] = React.useState<AddressAutocompleteValue | null>(null);

  console.log(value);

  const changeValue = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: AddressAutocompleteValue | null
  ) => {
    setValue(newValue);
  };

  return (
    <AddressAutocomplete
      apiKey={process.env.API_KEY || ''}
      fields={[]}
      label="Test"
      onChange={changeValue}
      value={value}
    />
  );
};

export default Component;
