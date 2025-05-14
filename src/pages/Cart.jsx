import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart } from '@src/redux/thunks/cartThunks.js';
import { setDeliveryMethod, setSelectedRestaurant } from '@src/redux/slices/restaurantSlice.js';
import { getRestaurantThunk } from '@src/redux/thunks/restaurantThunks.js';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems, restaurantsProximity, selectedRestaurantListings, isPickup } = useSelector((state) => ({
        cartItems: state.cart.cartItems,
        restaurantsProximity: state.restaurant.restaurantsProximity,
        selectedRestaurantListings: state.restaurant.selectedRestaurantListings,
        isPickup: state.restaurant.isPickup
    }));

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (cartItems.length > 0) {
            const firstCartItem = cartItems[0];
            const restaurantId = firstCartItem.restaurant_id;

            const restaurant = restaurantsProximity.find(r => r.id === restaurantId);

            if (restaurant) {
                dispatch(setSelectedRestaurant(restaurant));
                dispatch(getRestaurantThunk(restaurant.id));
                if (restaurant.delivery && !restaurant.pickup) {
                    dispatch(setDeliveryMethod(false));
                } else if (!restaurant.delivery && restaurant.pickup) {
                    dispatch(setDeliveryMethod(true));
                }
            } else {
                alert('Restaurant not found. The restaurant is not in proximity. Cart will be cleared.');
            }
        }
    }, [cartItems, restaurantsProximity, dispatch]);

    const ListingsInCart = selectedRestaurantListings.filter(listing =>
        cartItems.some(cartItem => cartItem.listing_id === listing.id)
    );

    const totalPickUpPrice = ListingsInCart.reduce((sum, item) => {
        const cartItem = cartItems.find(ci => ci.listing_id === item.id);
        const quantity = cartItem?.count || 1;
        return sum + (item.pick_up_price || 0) * quantity;
    }, 0);

    const totalDeliveryPrice = ListingsInCart.reduce((sum, item) => {
        const cartItem = cartItems.find(ci => ci.listing_id === item.id);
        const quantity = cartItem?.count || 1;
        return sum + (item.delivery_price || 0) * quantity;
    }, 0);

    const currentTotal = isPickup ? totalPickUpPrice : totalDeliveryPrice;

    const calculateItemSubtotal = (listing, isPickup) => {
        const cartItem = cartItems.find(ci => ci.listing_id === listing.id);
        const quantity = cartItem?.count || 1;
        const price = isPickup ? listing.pick_up_price : listing.delivery_price;
        return (price || 0) * quantity;
    };

    const restaurant = restaurantsProximity.find(r => r.id === (cartItems[0]?.restaurant_id));
    const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.count || 1), 0);
    const deliveryFee = !isPickup && restaurant?.deliveryFee ? restaurant.deliveryFee : 0;
    const finalTotal = currentTotal + deliveryFee;

    const handleRemoveFromCart = (listing) => {
        dispatch({
            type: 'cart/removeItemFromCart',
            payload: { listing_id: listing.id }
        });
    };

    const handleUpdateQuantity = (listing, newCount) => {
        if (newCount <= 0) {
            handleRemoveFromCart(listing);
            return;
        }

        dispatch({
            type: 'cart/updateCartItem',
            payload: {
                payload: {
                    listing_id: listing.id,
                    count: newCount
                }
            }
        });
    };

    const handleToggleDeliveryMethod = (newIsPickup) => {
        dispatch(setDeliveryMethod(newIsPickup));
    };

    const getFreshScoreColor = (score) => {
        if (score >= 80) return '#059669';
        if (score >= 50) return '#F59E0B';
        return '#DC2626';
    };

    return (
        <div className="cart-page">
            <div className="container py-4">
                <div className="cart-header mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="cart-title">Your Cart <span className="item-count-badge">{totalItemsCount}</span></h1>
                        <button onClick={() => navigate(-1)} className="btn-back">
                            <i className="bi bi-arrow-left"></i> Back
                        </button>
                    </div>

                    {restaurant && (
                        <div className="restaurant-info-bar mt-3 d-flex justify-content-between align-items-center">
                            <div className="restaurant-info">
                                <i className="bi bi-building me-2"></i>
                                <span className="restaurant-name">{restaurant.restaurantName}</span>
                            </div>

                            <div className="delivery-toggle">
                                {restaurant.pickup && restaurant.delivery ? (
                                    <div className="btn-group">
                                        <button
                                            className={`btn ${isPickup ? 'btn-dark' : 'btn-light'}`}
                                            onClick={() => handleToggleDeliveryMethod(true)}
                                        >
                                            Pick Up
                                        </button>
                                        <button
                                            className={`btn ${!isPickup ? 'btn-dark' : 'btn-light'}`}
                                            onClick={() => handleToggleDeliveryMethod(false)}
                                        >
                                            Delivery
                                        </button>
                                    </div>
                                ) : (
                                    <button className="btn btn-dark" disabled>
                                        {restaurant.pickup ? 'Pick Up Only' : 'Delivery Only'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {ListingsInCart.length > 0 ? (
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="cart-items">
                                {ListingsInCart.map(listing => {
                                    const cartItem = cartItems.find(ci => ci.listing_id === listing.id);
                                    const quantity = cartItem?.count || 1;
                                    const itemSubtotal = calculateItemSubtotal(listing, isPickup);
                                    const displayPrice = isPickup ? listing.pick_up_price : listing.delivery_price;

                                    return (
                                        <div key={listing.id} className="cart-item">
                                            <div className="cart-item-image">
                                                <img
                                                    src={listing.image_url || 'https://via.placeholder.com/150'}
                                                    alt={listing.title}
                                                />
                                                <div
                                                    className="fresh-score-badge"
                                                    style={{
                                                        backgroundColor: `${getFreshScoreColor(listing.fresh_score)}20`,
                                                        borderColor: getFreshScoreColor(listing.fresh_score)
                                                    }}
                                                >
                                                    <i
                                                        className="bi bi-leaf"
                                                        style={{color: getFreshScoreColor(listing.fresh_score)}}
                                                    ></i>
                                                    <span style={{color: getFreshScoreColor(listing.fresh_score)}}>
                                                        {Math.round(listing.fresh_score)}% Fresh
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="cart-item-details">
                                                <h3 className="item-title">{listing.title}</h3>
                                                <p className="item-description">{listing.description}</p>

                                                <div className="price-quantity-row">
                                                    <div className="price-container">
                                                        <div className="current-price">{displayPrice.toFixed(2)} TL</div>
                                                        {listing.original_price > displayPrice && (
                                                            <div className="original-price">{listing.original_price.toFixed(2)} TL</div>
                                                        )}
                                                    </div>

                                                    <div className="quantity-controls">
                                                        <button
                                                            className="quantity-btn minus-btn"
                                                            onClick={() => handleUpdateQuantity(listing, quantity - 1)}
                                                        >
                                                            <i className="bi bi-dash"></i>
                                                        </button>
                                                        <span className="quantity">{quantity}</span>
                                                        <button
                                                            className="quantity-btn plus-btn"
                                                            onClick={() => handleUpdateQuantity(listing, quantity + 1)}
                                                            disabled={quantity >= listing.count}
                                                        >
                                                            <i className="bi bi-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="item-subtotal">
                                                    <span>Subtotal:</span> <strong>{itemSubtotal.toFixed(2)} TL</strong>
                                                </div>

                                                <button
                                                    className="remove-item-btn"
                                                    onClick={() => handleRemoveFromCart(listing)}
                                                >
                                                    <i className="bi bi-trash"></i> Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="order-summary">
                                <h3 className="summary-title">Order Summary</h3>

                                <div className="summary-item">
                                    <span>Subtotal</span>
                                    <span>{currentTotal.toFixed(2)} TL</span>
                                </div>

                                {!isPickup && restaurant && restaurant.deliveryFee > 0 && (
                                    <div className="summary-item">
                                        <span>Delivery Fee</span>
                                        <span>{restaurant.deliveryFee.toFixed(2)} TL</span>
                                    </div>
                                )}

                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>{finalTotal.toFixed(2)} TL</span>
                                </div>

                                <Link to="/checkout" className="checkout-btn">
                                    <i className="bi bi-cart-check"></i>
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <i className="bi bi-cart"></i>
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Add items from restaurants to get started</p>
                        <Link to="/" className="browse-btn">
                            <i className="bi bi-shop"></i>
                            Browse Restaurants
                        </Link>
                    </div>
                )}
            </div>

            <style jsx>{`
                .cart-page {
                    background-color: #F9FAFB;
                    min-height: 100vh;
                    padding-bottom: 40px;
                }
                
                .cart-header {
                    background-color: #FFFFFF;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .cart-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                }
                
                .item-count-badge {
                    display: inline-block;
                    background-color: #50703C;
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    padding: 4px 12px;
                    border-radius: 20px;
                    margin-left: 10px;
                    vertical-align: middle;
                }
                
                .btn-back {
                    background: none;
                    border: none;
                    color: #6B7280;
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .btn-back:hover {
                    color: #111827;
                }
                
                .restaurant-info-bar {
                    background-color: #F9FAFB;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-top: 16px;
                }
                
                .restaurant-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #4B5563;
                    font-weight: 500;
                }
                
                .cart-items {
                    margin-bottom: 20px;
                }
                
                .cart-item {
                    display: flex;
                    background-color: #FFFFFF;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: 16px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                
                .cart-item-image {
                    width: 180px;
                    height: 180px;
                    position: relative;
                }
                
                .cart-item-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .fresh-score-badge {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 8px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    border-width: 1px;
                    border-style: solid;
                    background-color: white;
                }
                
                .cart-item-details {
                    flex: 1;
                    padding: 16px;
                    position: relative;
                }
                
                .item-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #111827;
                }
                
                .item-description {
                    font-size: 14px;
                    color: #6B7280;
                    margin-bottom: 12px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .price-quantity-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                
                .price-container {
                    display: flex;
                    flex-direction: column;
                }
                
                .current-price {
                    font-size: 18px;
                    font-weight: 700;
                    color: #059669;
                }
                
                .original-price {
                    font-size: 14px;
                    color: #9CA3AF;
                    text-decoration: line-through;
                }
                
                .quantity-controls {
                    display: flex;
                    align-items: center;
                    background-color: #F3F4F6;
                    border-radius: 8px;
                    padding: 4px;
                }
                
                .quantity-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    background-color: white;
                    cursor: pointer;
                }
                
                .minus-btn {
                    color: #DC2626;
                }
                
                .plus-btn {
                    color: #059669;
                }
                
                .quantity {
                    width: 40px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 16px;
                }
                
                .item-subtotal {
                    color: #4B5563;
                    font-size: 14px;
                    margin-bottom: 12px;
                }
                
                .remove-item-btn {
                    background: none;
                    border: none;
                    color: #DC2626;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 0;
                }
                
                .order-summary {
                    background-color: #FFFFFF;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    position: sticky;
                    top: 20px;
                }
                
                .summary-title {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: #111827;
                }
                
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-size: 16px;
                    color: #4B5563;
                }
                
                .summary-total {
                    display: flex;
                    justify-content: space-between;
                    padding-top: 16px;
                    margin-top: 16px;
                    border-top: 1px solid #E5E7EB;
                    font-size: 18px;
                    font-weight: 700;
                    color: #111827;
                }
                
                .checkout-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background-color: #50703C;
                    color: white;
                    width: 100%;
                    padding: 14px;
                    border-radius: 8px;
                    border: none;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 20px;
                    text-align: center;
                    text-decoration: none;
                }
                
                .checkout-btn:hover {
                    background-color: #455f31;
                    color: white;
                }
                
                .empty-cart {
                    background-color: #FFFFFF;
                    border-radius: 12px;
                    padding: 60px 20px;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                
                .empty-cart-icon {
                    width: 120px;
                    height: 120px;
                    background-color: #F0F9EB;
                    border-radius: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }
                
                .empty-cart-icon i {
                    font-size: 50px;
                    color: #50703C;
                }
                
                .empty-cart h2 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 12px;
                }
                
                .empty-cart p {
                    font-size: 16px;
                    color: #6B7280;
                    margin-bottom: 30px;
                }
                
                .browse-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background-color: #50703C;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    text-decoration: none;
                }
                
                .browse-btn:hover {
                    background-color: #455f31;
                    color: white;
                }
                
                @media (max-width: 768px) {
                    .cart-item {
                        flex-direction: column;
                    }
                    
                    .cart-item-image {
                        width: 100%;
                        height: 200px;
                    }
                    
                    .price-quantity-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }
                    
                    .order-summary {
                        margin-top: 20px;
                        position: static;
                    }
                    
                    .restaurant-info-bar {
                        flex-direction: column;
                        gap: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Cart;