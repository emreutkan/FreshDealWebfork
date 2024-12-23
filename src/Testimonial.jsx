import { Link } from 'react-router';
import './Testimonial.css'

function Testimonial() {
    return ( 
        <div className="testimonial_section layout_padding">
               <div className="container">
                  <div className="row">
                     <div className="col-sm-12">
                        <h1 className="testimonial_taital">Customers Says</h1>
                     </div>
                  </div>
                  <div id="my_slider" className="carousel slide" data-ride="carousel">
                     <div className="carousel-inner">
                        <div className="carousel-item active">
                           <div className="testimonial_section_2">
                              <div className="row">
                                 <div className="col-md-4">
                                    <h4 className="customer_text">Loliy Mark</h4>
                                    <p className="many_text">Now use Lorem Ipsum as their default model text, and a search for 'loremnow use Lorem Ipsum as their default model text, and a search for 'lorem</p>
                                 </div>
                                 <div className="col-md-4">
                                    <h4 className="customer_text">Den Mark</h4>
                                    <p className="many_text">Now use Lorem Ipsum as their default model text, and a search for 'loremnow use Lorem Ipsum as their default model text, and a search for 'lorem</p>
                                 </div>
                                 <div className="col-md-4">
                                    <h4 className="customer_text">Jonshon Mark</h4>
                                    <p className="many_text">Now use Lorem Ipsum as their default model text, and a search for 'loremnow use Lorem Ipsum as their default model text, and a search for 'lorem</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="carousel-item">
                           <div className="testimonial_section_2">
                              <div className="row">
                                 <div className="col-md-4">
                                    <h4 className="customer_text">Loliy Mark</h4>
                                    <p className="many_text">Now use Lorem Ipsum as their default model text, and a search for 'loremnow use Lorem Ipsum as their default model text, and a search for 'lorem</p>
                                 </div>
                                 <div className="col-md-4">
                                    <h4 className="customer_text">Den Mark</h4>
                                    <p className="many_text">Now use Lorem Ipsum as their default model text, and a search for 'loremnow use Lorem Ipsum as their default model text, and a search for 'lorem</p>
                                 </div>
                                 <div className="col-md-4">
                                    <h4 className="customer_text">Jonshon Mark</h4>
                                    <p className="many_text">Now use Lorem Ipsum as their default model text, and a search for 'loremnow use Lorem Ipsum as their default model text, and a search for 'lorem</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="carousel-item">
                           <div className="testimonial_section_2">
                              <div className="row">
                                 <div className="col-md-4">
                                    <h4 className="customer_text">Loliy Mark</h4>
                                    <p className="many_text">Now use Lorem Ipsum as their default model text, and a search for 'loremnow use Lorem Ipsum as their default model text, and a search for 'lorem</p>
                                 </div>
                                 <div className="col-md-4">
                                    <h4 className="customer_text">Den Mark</h4>
                                    <p className="many_text">Now use Lorem Ipsum as their default model text, and a search for 'loremnow use Lorem Ipsum as their default model text, and a search for 'lorem</p>
                                 </div>
                                 <div className="col-md-4">
                                    <h4 className="customer_text">Jonshon Mark</h4>
                                    <p className="many_text">Now use Lorem Ipsum as their default model text, and a search for 'loremnow use Lorem Ipsum as their default model text, and a search for 'lorem</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <Link className="carousel-control-prev" href="#my_slider" role="button" data-slide="prev">
                     <i className="fa fa-arrow-left"></i>
                     </Link>
                     <Link className="carousel-control-next" href="#my_slider" role="button" data-slide="next">
                     <i className="fa fa-arrow-right"></i>
                     </Link>
                  </div>
               </div>
            </div>
     );
}

export default Testimonial;