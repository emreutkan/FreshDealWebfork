import { useState } from 'react'
import Banner from './Banner'
import Service from './Service'
import Blog from './Restaurants'
import Shop from './Shop'
import Testimonial from './Testimonial'
import Contact from './Contact'
import Footer from './Footer'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="container-fluid">
         <div className="layout_main">
          <Banner/>
          <Service/>
          <Blog/>
          <Shop/>
          <Testimonial/>
          <Contact/>
          <Footer/>
         </div>
    </div>
  )
}

export default Home
