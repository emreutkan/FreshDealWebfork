import { useState } from 'react'
import Banner from './Banner'
import Service from './Service'

function Layout() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="container-fluid">
         <div className="layout_main">
          <Banner/>
          <Service/>
         </div>
    </div>
    </>
  )
}

export default Layout
