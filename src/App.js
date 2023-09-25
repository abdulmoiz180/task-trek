import React from 'react'
import './App.css'
import ForgetPassword from './pages/ForgetPassword'
const App = () => {
  return (
    <main className='App'>
      <ForgetPassword/>
      <h1>Welcome to Task Trek</h1>
      <p>A <span>Project Management System</span>, Where you can perform <span>CRUD </span>operations  on tasks.</p>
    </main>
  )
}

export default App