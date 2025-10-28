import { useState } from 'react';
import {Routes, Route} from "react-router-dom";
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Subscribe from './pages/Subscribe';


function App() {
  

  return (
    <>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] 2xl:px-[9vw]'>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/subscribe' element={<Subscribe />} />
        </Routes>
      </div>
    </>
  )
}

export default App
