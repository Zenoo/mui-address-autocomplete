import React from 'react';
import { AddressAutocompleteValue } from '../dist/AddressAutocomplete';
import AddressAutocomplete from '../src/AddressAutocomplete';

const Component = () => {
  const [value, setValue] = React.useState<AddressAutocompleteValue>(null);

  console.log(value);

  return (
    <AddressAutocomplete
      apiKey={process.env.API_KEY}
      fields={[]}
      label="Test"
      onChange={(_, val) => {
        setValue(val);
      }}
      value={value}
    />
  );
};

export default Component;
