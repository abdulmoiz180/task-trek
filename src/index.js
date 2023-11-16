import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { PageProvider } from './contexts/PageContext';
import { SearchProvider } from './contexts/SearchContext';
import { Provider } from 'react-redux';
import store from './redux/store'; 

ReactDOM.render(
  <React.StrictMode>
    <SearchProvider>
    <PageProvider>
      <Provider store= {store}>
      <App />
      </Provider>
    </PageProvider>
    </SearchProvider>
  </React.StrictMode>,
  document.getElementById('root')
);