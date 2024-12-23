import { Link } from 'react-router';
import './Shop.css'
import icon1 from './assets/icon-1.png'
import icon2 from './assets/icon-2.png'
import mobileImg from './assets/mobile-img.png'

function Shop() {
    return ( 
        <div className="shop_section layout_padding">
               <div className="container">
                  <div className="row">
                     <div className="col-md-6">
                        <h1 className="shop_taital">Get the <br/><span style={{ color: "#18191a" }}>FreshDeal App</span></h1>
                        <p className="shop_text">Long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as</p>
                        <div className="app_icon_main">
                           <div className="app_icon"><img src={icon1}/></div>
                           <div className="app_icon"><img src={icon2}/></div>
                        </div>
                        <div className="download_bt"><Link href="#">Download Now</Link></div>
                     </div>
                     <div className="col-md-6">
                        <div className="mobile_img"><img src={mobileImg}/></div>
                     </div>
                  </div>
               </div>
            </div>
     );
}

export default Shop;