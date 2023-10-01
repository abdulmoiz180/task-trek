import React from 'react'
import './App.css'
import Routers from './Routers/Routers';
import MenuBar from './layout/MenuBar';
import { SearchProvider } from './contexts/SearchContext';


const App = () => {
  return (
   
    <SearchProvider>
      <MenuBar/>
    <main className='App'>
      <Routers />
    </main>
    </SearchProvider>
  );
}



export default App;