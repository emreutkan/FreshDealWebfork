import { useState } from 'react'
import './Service.css'
import alcoholImg from './assets/alcohol-img.png'
import breakfastImg from './assets/breakfast-img.png'
import coffeeImg from './assets/coffee-img.png'
import diningtableImg from './assets/diningtable-img.png'
import deliveryImg from './assets/delivery-img.png'
import dinnerImg from './assets/dinner-img.png'

function Service() {
  const [count, setCount] = useState(0)

  return (
    <div className="service_section layout_padding">
               <div className="container">
                  <div className="row">
                     <div className="col-sm-12">
                        <h1 className="service_taital">Quick Searches</h1>
                     </div>
                  </div>
                  <div className="service_section_2">
                     <div className="row">
                        <div className="col">
                           <div className="service_box">
                              <div className="breakfast_img"><img src={breakfastImg}/></div>
                           </div>
                           <h4 className="breakfast_text">Breakfast</h4>
                           <div className="seemore_bt"><a href="#">See More</a></div>
                        </div>
                        <div className="col">
                           <div className="service_box">
                              <div className="breakfast_img"><img src={deliveryImg}/></div>
                           </div>
                           <h4 className="breakfast_text">Delivery</h4>
                           <div className="seemore_bt"><a href="#">See More</a></div>
                        </div>
                        <div className="col">
                           <div className="service_box">
                              <div className="breakfast_img"><img src={dinnerImg}/></div>
                           </div>
                           <h4 className="breakfast_text">Dinner</h4>
                           <div className="seemore_bt"><a href="#">See More</a></div>
                        </div>
                        <div className="col">
                           <div className="service_box">
                              <div className="breakfast_img"><img src={coffeeImg}/></div>
                           </div>
                           <h4 className="breakfast_text">Coffee</h4>
                           <div className="seemore_bt"><a href="#">See More</a></div>
                        </div>
                        <div className="col">
                           <div className="service_box">
                              <div className="breakfast_img"><img src={alcoholImg}/></div>
                           </div>
                           <h4 className="breakfast_text">Alcohol</h4>
                           <div className="seemore_bt"><a href="#">See More</a></div>
                        </div>
                        <div className="col">
                           <div className="service_box">
                              <div className="breakfast_img"><img src={diningtableImg}/></div>
                           </div>
                           <h4 className="breakfast_text">Diningtable</h4>
                           <div className="seemore_bt"><a href="#">See More</a></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
  )
}

export default Service
