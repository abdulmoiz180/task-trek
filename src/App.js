import React from 'react'
import './App.css'
import Routers from './Routers/Routers';
// import SearchProvider from './contexts/SearchContext'
import AppHeader from './layout/MenuBar'
import { SearchProvider } from './contexts/SearchContext';



const App = () => {

// useEffect(() =>{
   
//     });
// }, [])

  return (

   
    <SearchProvider>
   
      {/* <MenuBar/>
       */}
       <AppHeader/>
    <main className='App'>
      <Routers />
    </main>
    </SearchProvider>
  );
}



export default App;