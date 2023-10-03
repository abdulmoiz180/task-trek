import React from 'react'
import './App.css'
import Routers from './Routers/Routers';


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