import { useState } from 'react'
import Header from './Header'
import Layout from './Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Layout/>
    </>
  )
}

export default App
