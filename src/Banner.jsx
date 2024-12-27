import { useState } from 'react'
import { Link, NavLink } from 'react-router';
import './Banner.css'

function Banner() {
   const [count, setCount] = useState(0)

   return (
      <div className="banner_section">
         <div className="container">
            <div className="menu_main">
               <div className="custome_menu">
                  <ul>
                     <li><NavLink to="/">Home</NavLink></li>
                     <li><NavLink to="/service">Services</NavLink></li>
                     <li><NavLink to="/about">About</NavLink></li>
                     <li><NavLink to="/restaurants">Restaurants</NavLink></li>
                     <li><NavLink to="/shop">Shop</NavLink></li>
                     <li><NavLink to="/contact">Contacts</NavLink></li>
                  </ul>
               </div>
               <div className="login_menu">
                        <ul>
                           <li><NavLink to="/login">Login</NavLink></li>
                           <li><Link to="#"><i className="fa fa-search" aria-hidden="true"></i></Link></li>
                        </ul>
                     </div>
            </div>
         </div>
         <div id="main_slider" className="carousel slide" data-ride="carousel">
                  <div className="carousel-inner">
                     <div className="carousel-item active">
                        <div className="container">
                           <div className="row">
                              <div className="col-md-12">
                                 <h1 className="banner_taital">Find The Best Restaurants Cafes And Bars in </h1>
                                 <h1 className="banner_text">YOUR CITY</h1>
                                 <div className="banner_main">
                                    <div className="dropdown">
                                       <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">All Category 
                                       </button>
                                       <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                          <Link className="dropdown-item" to="#">Action</Link>
                                          <Link className="dropdown-item" to="#">Another action</Link>
                                          <Link className="dropdown-item" to="#">Something else here</Link>
                                       </div>
                                    </div>
                                    <div className="main">
                                    <div className="input-group">
                                          <input type="text" className="form-control" placeholder="Search" />
                                          <div className="input-group-append">
                                             <button className="btn btn-secondary" type="button" style={{backgroundColor:"#ffffff", borderColor:"#ffffff"}}>
                                             <i className="fa fa-search" style={{color: "#191919"}}></i>
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="ordernow_bt"><Link to="#">Order Now</Link></div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="carousel-item">
                        <div className='container'>
                           <div className='row'>
                              <div className='col-md-12'>
                                 <h1 className='banner_taital'>Find The Best Restaurants Cafes And Bars in </h1>
                                 <h1 className="banner_text">YOUR CITY</h1>
                                 <div className="banner_main">
                                    <div className='dropdown'>
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">All Category
                                       </button>
                                       <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                          <Link className="dropdown-item" to="#">Action</Link>
                                          <Link className="dropdown-item" to="#">Another action</Link>
                                          <Link className="dropdown-item" to="#">Something else here</Link>
                                       </div>
                                    </div>
                                    <div className='main'>
                                    <div className="input-group">
                                          <input type="text" className="form-control" placeholder="Search this blog" />
                                          <div className="input-group-append">
                                             <button className="btn btn-secondary" type="button" style={{backgroundColor: "#ffffff", borderColor:"#ffffff"}}>
                                             <i className="fa fa-search" style={{color: "#191919"}}></i>
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="ordernow_bt"><Link to="#">Order Now</Link></div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="carousel-item">
                        <div className="container">
                           <div className="row">
                              <div className="col-md-12">
                                 <h1 className="banner_taital">Find The Best Restaurants Cafes And Bars in </h1>
                                 <h1 className="banner_text">YOUR CITY</h1>
                                 <div className="banner_main">
                                    <div className="dropdown">
                                       <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">All Category 
                                       </button>
                                       <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                          <Link className="dropdown-item" to="#">Action</Link>
                                          <Link className="dropdown-item" to="#">Another action</Link>
                                          <Link className="dropdown-item" to="#">Something else here</Link>
                                       </div>
                                    </div>
                                    <div className="main">
                                       <div className="input-group">
                                          <input type="text" className="form-control" placeholder="Search this blog" />
                                          <div className="input-group-append">
                                             <button className="btn btn-secondary" type="button" style={{backgroundColor: "#ffffff", borderColor:"#ffffff"}}>
                                             <i className="fa fa-search" style={{color: "#191919"}}></i>
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div class="ordernow_bt"><Link to="#">Order Now</Link></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <a className="carousel-control-prev" href="#main_slider" role="button" data-slide="prev">
                  <i className="fa fa-angle-left"></i>
                  </a>
                  <a className="carousel-control-next" href="#main_slider" role="button" data-slide="next">
                  <i className="fa fa-angle-right"></i>
                  </a>
               </div>
      </div>
   )
}

export default Banner
