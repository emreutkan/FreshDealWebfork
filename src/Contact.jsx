import { Link } from 'react-router';
import { Form, Formik } from 'formik';
import './Contact.css'
import Order from './Order'
import { contactSchema } from './schemas';
import ContactInput from './components/ContactInput';
import ContactTextArea from './components/ContactTextArea';

const onSubmit = async (values, actions) => {
   await new Promise((resolve) => {
      setTimeout(resolve, 1000)
   })
   actions.resetForm();
}

function Contact() {
   return (
      <div className="contact_section layout_padding">
         <div className="container">
            <div className="contact_section_2">
               <div className="row">
                  <div className="col-md-12">
                     <h1 className="contact_taital">Get In Touch</h1>
                     <Formik
                        initialValues={{
                           name: '',
                           phone: '',
                           email: '',
                           comment: ''
                        }}
                        onSubmit={onSubmit}
                        validationSchema={contactSchema}
                     >
                        {({ isSubmitting }) => (
                           <Form>
                              <div className="mail_section_1">
                                 <ContactInput
                                    id="name"
                                    name="Name"
                                    type="text"
                                    placeholder="Name"
                                 />
                                 <ContactInput
                                    id="phone"
                                    name="Phone Number"
                                    type="text"
                                    placeholder="Phone Number"
                                 />
                                 <ContactInput
                                    id="email"
                                    name="Email"
                                    type="text"
                                    placeholder="Email"
                                 />
                                 <ContactTextArea
                                 id="comment"
                                    name="Message"
                                    placeholder="Message"
                                    rows="5"
                                 />
                                 <button disabled={isSubmitting} className="send_bt" type='submit'><div>SEND</div></button>
                              </div>
                           </Form>
                        )}
                     </Formik>
                  </div>
               </div>
               <Order />
            </div>
         </div>
      </div>
   );
}

export default Contact;