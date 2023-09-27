import React from 'react'
import "App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
const App = () => {
  return (
    <main className='App'>
     <Router>
         <Routes>
        <Route exact path="/" element={<Login /> } />
        {/* <Route exact path="/reset-password" element={<ForgetPassword /> } />
        <Route exact path="/register" element={<Registration /> } /> */}
        <Route exact path="/change-pwd" element={<ChangePassword /> }/>
        </Routes>
      </Router>
    </main>
  )
}

export default App