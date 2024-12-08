import { useState } from 'react'
import Header from './Header'
import Layout from './Layout'
import LoginPage from './LoginPage'
import userLogin from './api'

function App() {
  const [count, setCount] = useState(0)

  const handleLogin = (email, password) => {
    debugger;
    userLogin(email, password)
  }

  return (
    <>
      <Header />
      <Layout />
      <LoginPage login={handleLogin} />
    </>
  )
}

export default App
