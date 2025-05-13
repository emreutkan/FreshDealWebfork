// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantThunk, getListingsThunk } from "@src/redux/thunks/restaurantThunks.js";
import { addItemToCart } from "@src/redux/thunks/cartThunks.js";

const RestaurantDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState("");

    const restaurant = useSelector((state) => state.restaurant.selectedRestaurant);
    const listings = useSelector((state) => state.restaurant.selectedRestaurantListings);
    const loading = useSelector((state) => state.restaurant.listingsLoading);

    useEffect(() => {
        dispatch(getRestaurantThunk(id));
        dispatch(getListingsThunk({ restaurantId: id, page: 1, perPage: 10 }));
    }, [dispatch, id]);

    if (loading || !restaurant) return <div>Loading...</div>;

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
                                            await dispatch(addItemToCart({ listing_id: listing.id, restaurant_id: id }));
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

export default RestaurantDetails;