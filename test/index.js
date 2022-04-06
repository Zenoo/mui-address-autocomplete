
import React from 'react';

import ReactDOM from 'react-dom';
import AddressAutocomplete from '../src/AddressAutocomplete';

const body = document.getElementsByTagName('BODY')[0];
const root = document.createElement('div');
root.id = 'root';
body.appendChild(root);

let value = null;

ReactDOM.render((<AddressAutocomplete
  apiKey={process.env.API_KEY}
  fields={['address_components']}
  label="Test"
  onChange={(val) => {
    value = val;
    console.log(val);
  }}
  value={value}
/>), root);
