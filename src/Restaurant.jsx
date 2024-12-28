import { Link } from 'react-router';

function Restaurant({ restaurantImg, restaurantName, restaurantContent, restaurantLink }) {
    return (
        <>
            <div className="col-md-6">
                <div className="restaurant_img"><img src={restaurantImg} /></div>
            </div>
            <div className="col-md-6">
                <div className="restaurant_taital_main">
                    <h1 className="restaurant_text">{restaurantName}</h1>
                    <p className="lorem_text">{restaurantContent}</p>
                    <div className="readmore_btn"><Link to={`/${restaurantLink}`}>Read More</Link></div>
                </div>
            </div>
        </>
    );
}

export default Restaurant;