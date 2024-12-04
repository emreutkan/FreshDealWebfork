import { useState } from 'react'
import './Header.css'

function Header() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container-fluid">
         <div className="header_section">
            <div className="container">
               <nav className="navbar navbar-light bg-light justify-content-between">
                  <div id="mySidenav" className="sidenav">
                     <a href="javascript:void(0)" className="closebtn" onclick="closeNav()">&times;</a>
                     <a href="index.html">Home</a>
                     <a href="service.html">Services</a>
                     <a href="about.html">About</a>
                     <a href="blog.html">Blog</a>
                     <a href="shop.html">Shop</a>
                     <a href="contacts.html">Contacts</a>
                  </div>
                  <form className="form-inline ">
                     <div className="login_text"><a href="#"><i className="fa fa-phone" aria-hidden="true"></i><span className="padding_left10">Call : +01 1234567890</span></a></div>
                  </form>
                  <a className="logo" href="index.html"><img src="/fevicon.png" /></a>
                  <span className="toggle" onclick="openNav()"><i className="fa fa-bars"></i></span>
                  <div className="login_text"><a href="#"><i className="fa fa-envelope" aria-hidden="true"></i><span className="padding_left10">Email : Demo@gmail.com</span></a></div>
               </nav>
            </div>
         </div>
      </div>
    </>
  )
}

export default Header
