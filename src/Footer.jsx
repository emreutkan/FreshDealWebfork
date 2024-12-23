import { Link } from 'react-router';
import './Footer.css'

function Footer() {
    return ( 
        <div className="footer_section">
               <div className="container">
                  <div className="footer_sectio_2">
                     <div className="row">
                        <div className="col-lg-3 col-md-6">
                           <h2 className="footer_logo">FreshDeal</h2>
                           <p className="footer_text">t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of </p>
                        </div>
                        <div className="col-lg-3 col-md-6">
                           <h2 className="useful_text">Navigation</h2>
                           <div className="footer_menu">
                              <ul>
                                 <li className="active"><Link href="index.html">Home</Link></li>
                                 <li><Link href="about.html">About</Link></li>
                                 <li><Link href="location.html">Location</Link></li>
                                 <li><Link href="service.html">Services</Link></li>
                                 <li><Link href="features.html">Features</Link></li>
                              </ul>
                           </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                           <h2 className="useful_text">Contact Info</h2>
                           <p className="address_text">Office Address</p>
                           <div className="map_icon"><Link href="#"><i className="fa fa-map-marker" aria-hidden="true"></i><span className="padding_left15">Loram ipusm New York, NY 36524</span></Link></div>
                           <p className="address_text">Customer Service:</p>
                           <div className="map_icon"><Link href="#"><i className="fa fa-phone" aria-hidden="true"></i><span className="padding_left15">( +01 1234567890 )</span></Link></div>
                           <div className="map_icon"><Link href="#"><i className="fa fa-envelope" aria-hidden="true"></i><span className="padding_left15">demo@gmail.com</span></Link></div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                           <h2 className="useful_text">Discover</h2>
                           <div className="subscribe_menu">
                              <ul>
                                 <li><Link href="#">Help</Link></li>
                                 <li><Link href="#">How It Works</Link></li>
                                 <li><Link href="#">subscribe</Link></li>
                                 <li><Link href="contact.html">Contact Us</Link></li>
                              </ul>
                           </div>
                           <div className="social_icon">
                              <ul>
                                 <li><Link href="#"><i className="fa fa-facebook" aria-hidden="true"></i></Link></li>
                                 <li><Link href="#"><i className="fa fa-twitter" aria-hidden="true"></i></Link></li>
                                 <li><Link href="#"><i className="fa fa-linkedin" aria-hidden="true"></i></Link></li>
                                 <li><Link href="#"><i className="fa fa-instagram" aria-hidden="true"></i></Link></li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
     );
}

export default Footer;