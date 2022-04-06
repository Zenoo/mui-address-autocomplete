import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';

const [body] = document.getElementsByTagName('BODY');
const root = document.createElement('div');
root.id = 'root';
body.appendChild(root);

ReactDOM.render(<Component />, root);
