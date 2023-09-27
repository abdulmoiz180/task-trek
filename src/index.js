import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { PageProvider, usePage } from './contexts/PageContext';

ReactDOM.render(
  <PageProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  </PageProvider>,
  document.getElementById('root')
);