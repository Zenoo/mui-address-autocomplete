
import React from 'react';

import ReactDOM from 'react-dom';
import AddressAutocomplete from '../src/AddressAutocomplete';

const body = document.getElementsByTagName('BODY')[0];
const root = document.createElement('div');
root.id = 'root';
body.appendChild(root);

ReactDOM.render((<AddressAutocomplete apiKey={process.env.API_KEY} />), root);
