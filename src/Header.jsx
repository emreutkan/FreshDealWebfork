import { useState } from 'react'
import { Link } from 'react-router';
import './Header.css'

function Header() {
  const [count, setCount] = useState(0)

  function openNav() {
   document.getElementById("mySidenav").style.width = "100%";
 }
 
 function closeNav() {
   document.getElementById("mySidenav").style.width = "0";
 }

  return (
    <>
      <div className="container-fluid">
         <div className="header_section">
            <div className="container">
               <nav className="navbar navbar-light bg-light justify-content-between">
                  <div id="mySidenav" className="sidenav">
                     <Link to="javascript:void(0)" className="closebtn" onclick={closeNav}>&times;</Link>
                     <Link to="/">Home</Link>
                     <Link to="/service">Services</Link>
                     <Link to="/about">About</Link>
                     <Link to="/blog">Blog</Link>
                     <Link to="/shop">Shop</Link>
                     <Link to="/contact">Contacts</Link>
                  </div>
                  <form className="form-inline ">
                     <div className="login_text"><Link to="#"><i className="fa fa-phone" aria-hidden="true"></i><span className="padding_left10">Call : +01 1234567890</span></Link></div>
                  </form>
                  <Link className="logo" to="index.html"><img src="/fevicon.png" /></Link>
                  <span className="toggle" onclick={openNav}><i className="fa fa-bars"></i></span>
                  <div className="login_text"><Link to="#"><i className="fa fa-envelope" aria-hidden="true"></i><span className="padding_left10">Email : Demo@gmail.com</span></Link></div>
               </nav>
            </div>
         </div>
      </div>
    </>
  )
}

export default Header
