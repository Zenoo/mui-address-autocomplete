import React from 'react';
import { createRoot } from 'react-dom/client';
import Component from './Component';

const [body] = document.getElementsByTagName('BODY');
const rootDiv = document.createElement('div');
rootDiv.id = 'root';
body.appendChild(rootDiv);

const root = createRoot(rootDiv);
root.render(<Component />);