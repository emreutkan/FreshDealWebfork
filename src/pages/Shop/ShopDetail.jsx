import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import CartContext from "../../context/CartContext";

const ShopDetail = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [listings, setListings] = useState([]);
    const { cartRestaurantId, setCartRestaurantId, addToCart } = useContext(CartContext);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios.get(`https://freshdealbackend.azurewebsites.net/v1/restaurants/${id}`).then(res => setRestaurant(res.data));
        axios.get(`https://freshdealbackend.azurewebsites.net/v1/listings?restaurant_id=${id}&page=1&per_page=10`).then(res => setListings(res.data.data));
    }, [id]);

    if (!restaurant) return <div>Loading...</div>;

    return (
        <div className="container my-5">
            <h1>{restaurant.restaurantName}</h1>
            <p>{restaurant.restaurantDescription}</p>
            <p>⭐ {restaurant.rating} ({restaurant.ratingCount} reviews)</p>
            <p>⏰ Opening: {restaurant.workingHoursStart}</p>

            <hr />

            <h2>Menu</h2>
            <div className="row">
                {listings.map((listing) => (
                    <div className="col-md-4" key={listing.id}>
                        <div className="card mb-4">
                            <img src={listing.image_url} className="card-img-top" alt={listing.title} />
                            <div className="card-body">
                                <h5 className="card-title">{listing.title}</h5>
                                <p className="card-text">{listing.description}</p>
                                <p className="card-text">${listing.pick_up_price}</p>
                                <button
  className="btn btn-primary"
  onClick={async () => {
    try {
      await addToCart(listing.id, id);
    } catch (error) {
      console.error("Hata:", error);
      setErrorMessage("Cannot add item from a different restaurant. Please reset your cart before adding items from another restaurant.");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  }}
>
  Add to Cart
</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {errorMessage && (
                <div className="error-popup">
                    {errorMessage}
                </div>
            )}
        </div>
    )
}

export default ShopDetail;