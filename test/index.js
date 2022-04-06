import React from 'react';

import ReactDOM from 'react-dom';
import AddressAutocomplete from '../dist/AddressAutocomplete';

const [body] = document.getElementsByTagName('BODY');
const root = document.createElement('div');
root.id = 'root';
body.appendChild(root);

let value = null;

ReactDOM.render((<AddressAutocomplete
  apiKey={process.env.API_KEY}
  fields={['address_components']}
  label="Test"
  onChange={(_, val) => {
    value = val;
    console.log(val);
  }}
  value={value}
  sx={{ bgcolor: 'blue' }}
  blabla
/>), root);
