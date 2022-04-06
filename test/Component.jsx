import React from 'react';
import AddressAutocomplete from '../dist/AddressAutocomplete';

const Component = () => {
  const [value, setValue] = React.useState(null);

  console.log(value);

  return (
    <AddressAutocomplete
      apiKey={process.env.API_KEY}
      fields={['address_components']}
      label="Test"
      onChange={(_, val) => {
        setValue(val);
      }}
      value={value}
    />
  );
};

export default Component;
