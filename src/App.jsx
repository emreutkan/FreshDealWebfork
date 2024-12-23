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
import BlogPage from './BlogPage'
import ErrorPage from './ErrorPage'

function App() {

  /*const deleteAccountById = (id) => {
    const response = await axios.delete('https://freshdealapi-fkfaajfaffh4c0ex.uksouth-01.azurewebsites.net/v1/register');
    const afterDeletingAccount = accounts.filter((account) => {
      return account.id !== id;
    })
    setAccounts(afterDeletingAccount)
  }*/


  return (
    <>
<Header />
      
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/service' element={<ServicePage />}/>
        <Route path='/about' element={<AboutPage />}/>
        <Route path='/blog' element={<BlogPage />}/>
        <Route path='/shop' element={<ShopPage />}/>
        <Route path='/contact' element={<ContactPage />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<Register /*onDelete={deleteAccountById}*/ />}/>
        <Route path='*' element={<ErrorPage />}/>
      </Routes>

      <Copyright />
    </>
  )
}

export default App
