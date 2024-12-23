import { Link } from 'react-router';
import './Order.css'

function Order() {
    return (
        <div className="order_section">
            <div className="order_taital_main">
                <h1 className="order_taital">Order Best food at time</h1>
                <div className="order_bt"><Link href="#">Order Now</Link></div>
            </div>
        </div>
    );
}

export default Order;