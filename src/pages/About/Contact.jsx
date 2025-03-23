import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { Form, Formik } from 'formik';
import { contactSchema } from '@src/schemas/index.js';
import ContactInput from '@src/CustomInputs/ContactInput';
import ContactTextArea from '@src/CustomInputs/ContactTextArea';

const Contact = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const onSubmit = async (values, actions) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
    actions.resetForm();
  }

  return (
    <div>
      <div>
        {loaderStatus ? (
          <div className="loader-container">
            <MagnifyingGlass
              visible={true}
              height="100"
              width="100"
              ariaLabel="magnifying-glass-loading"
              wrapperStyle={{}}
              wrapperclassName="magnifying-glass-wrapper"
              glassColor="#c0efff"
              color="#0aad0a"
            />
          </div>
        ) : (
          <>
           <>
            <ScrollToTop/>
            </>
            <>
              {/* section */}
              <section className="my-lg-14 my-8">
                {/* container */}
                <div className="container">
                  <div className="row">
                    {/* col */}
                    <div className="offset-lg-2 col-lg-8 col-12">
                      <div className="mb-8">
                        {/* heading */}
                        <h1 className="h3">Retailer Inquiries</h1>
                        <p className="lead mb-0">
                          This form is for retailer inquiries only. For all
                          other customer or shopper support requests, please
                          visit the links below this form.
                        </p>
                      </div>
                      <Formik
                          initialValues={{
                            firstName: '',
                            lastName: '',
                            company: '',
                            title: '',
                            phone: '',
                            email: '',
                            comment: ''
                          }}
                          onSubmit={onSubmit}
                          validationSchema={contactSchema}
                      >
                        {({ isSubmitting }) => (
                            <Form className="row">
                              <div className="col-md-6 mb-3">
                                <ContactInput
                                    label="First Name"
                                    required={true}
                                    name="firstName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Your First Name"
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <ContactInput
                                    label="Last Name"
                                    required={true}
                                    name="lastName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Your Last Name"
                                />
                              </div>
                              <div className="col-md-12 mb-3">
                                <ContactInput
                                    label="Company"
                                    required={true}
                                    name="company"
                                    type="text"
                                    className="form-control"
                                    placeholder="Your Company"
                                />
                              </div>
                              <div className="col-md-12 mb-3">
                                <ContactInput
                                    label="Title"
                                    required={false}
                                    name="title"
                                    type="text"
                                    className="form-control"
                                    placeholder="Your Title"
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <ContactInput
                                    label="E-mail"
                                    required={true}
                                    name="email"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Your E-mail"
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <ContactInput
                                    label="Phone"
                                    required={false}
                                    name="phone"
                                    type="text"
                                    className="form-control"
                                    placeholder="Your Phone Number"
                                />
                              </div>
                              <div className="col-md-12 mb-3">
                                <ContactTextArea
                                    label="Comments"
                                    name="comment"
                                    type="text"
                                    className="form-control"
                                    placeholder="Additional Comments"
                                    rows="3"
                                />
                              </div>
                              <div className="col-md-12">
                                <button disabled={isSubmitting} type="submit" className="btn btn-primary">
                                  Submit
                                </button>
                              </div>
                            </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </section>
            </>
          </>
        )}
      </div>
    </div>
  );
};

export default Contact;
