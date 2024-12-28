import { useState } from 'react'
import Header from './Header'
import Home from './Home'
import ServicePage from './ServicePage'
import Copyright from './Copyright'
import AboutPage from './AboutPage'
import LoginPage from './LoginPage'
import ShopPage from './ShopPage'
import ContactPage from './ContactPage'
import Register from './components/Register'
import { Routes, Route } from 'react-router'
import RestaurantsPage from './RestaurantsPage'
import ErrorPage from './ErrorPage'

function App() {

  return (
    <>
    <Header />
      
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/service' element={<ServicePage />}/>
        <Route path='/about' element={<AboutPage />}/>
        <Route path='/restaurants' element={<RestaurantsPage />}/>
        <Route path='/shop' element={<ShopPage />}/>
        <Route path='/contact' element={<ContactPage />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='*' element={<ErrorPage />}/>
      </Routes>

    <Copyright />
    </>
  )
}

export default App
