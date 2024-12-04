import { useState } from 'react'
import './Banner.css'

function Banner() {
   const [count, setCount] = useState(0)

   return (
      <div className="banner_section">
         <div className="container">
            <div className="menu_main">
               <div className="custome_menu">
                  <ul>
                     <li className="active"><a href="index.html">Home</a></li>
                     <li><a href="service.html">Services</a></li>
                     <li><a href="about.html">About</a></li>
                     <li><a href="blog.html">Blog</a></li>
                     <li><a href="shop.html">Shop</a></li>
                     <li><a href="contact.html">Contacts</a></li>
                  </ul>
               </div>
               <div className="login_menu">
                        <ul>
                           <li><a href="#">Login</a></li>
                           <li><a href="#"><i className="fa fa-search" aria-hidden="true"></i></a></li>
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
                                          <a className="dropdown-item" href="#">Action</a>
                                          <a className="dropdown-item" href="#">Another action</a>
                                          <a className="dropdown-item" href="#">Something else here</a>
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
                                 <div className="ordernow_bt"><a href="#">Order Now</a></div>
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
                                          <a className="dropdown-item" href="#">Action</a>
                                          <a className="dropdown-item" href="#">Another action</a>
                                          <a className="dropdown-item" href="#">Something else here</a>
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
                                 <div className="ordernow_bt"><a href="#">Order Now</a></div>
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
                                          <a className="dropdown-item" href="#">Action</a>
                                          <a className="dropdown-item" href="#">Another action</a>
                                          <a className="dropdown-item" href="#">Something else here</a>
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
                                 <div class="ordernow_bt"><a href="#">Order Now</a></div>
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
