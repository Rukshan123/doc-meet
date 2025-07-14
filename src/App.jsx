import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointments from './pages/Appointments'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%'>
      <Navbar />
     <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/doctors' element={<Doctors />} />
      <Route path='/doctors:speciality' element={<Doctors />} />
      <Route path='/my-profile' element={<MyProfile />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/my-appointments' element={<MyAppointments />} />
      <Route path='/appointments:docId' element={<Appointments />} />
     </Routes>
    </div>
  )
}

export default App
