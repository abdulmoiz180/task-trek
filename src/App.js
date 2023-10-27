import React from 'react'
import './App.css'
import Routers from './Routers/Routers';
import { SearchProvider } from './contexts/SearchContext';


const App = () => {
  return (
    <SearchProvider>
      <main className='App'>
        <Routers />
      </main>
    // </SearchProvider>
  );
}



export default App;
