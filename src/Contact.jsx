import { Link } from 'react-router';
import './Contact.css'
import Order from './Order'

function Contact() {
    return ( 
        <div className="contact_section layout_padding">
               <div className="container">
                  <div className="contact_section_2">
                     <div className="row">
                        <div className="col-md-12">
                           <h1 className="contact_taital">Get In Touch</h1>
                           <form action="">
                              <div className="mail_section_1">
                                 <input type="text" className="mail_text" placeholder="Name" name="Name"/>
                                 <input type="text" className="mail_text" placeholder="Phone Number" name="Phone Number"/> 
                                 <input type="text" className="mail_text" placeholder="Email" name="Email"/>
                                 <textarea className="message-bt" placeholder="Message" rows="5" id="comment" name="Message"></textarea>
                                 <div className="send_bt"><Link href="#">SEND</Link></div>
                              </div>
                           </form>
                        </div>
                     </div>
                     <Order/>
                  </div>
               </div>
            </div>
     );
}

export default Contact;