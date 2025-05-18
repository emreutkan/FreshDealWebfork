import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getRestaurantThunk, getListingsThunk, getRestaurantBadgesThunk } from "@src/redux/thunks/restaurantThunks.js";
import { addItemToCart, fetchCart, removeItemFromCart, updateCartItem } from "@src/redux/thunks/cartThunks.js";
import { format, addDays } from 'date-fns';

const RestaurantDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(null);

    const restaurant = useSelector((state) => state.restaurant.selectedRestaurant);
    const listings = useSelector((state) => state.restaurant.selectedRestaurantListings);
    const loading = useSelector((state) => state.restaurant.listingsLoading);
    const cart = useSelector((state) => state.cart);
    const isPickup = useSelector((state) => state.restaurant.isPickup);
    const badges = useSelector((state) => state.restaurant.selectedRestaurant.badges || []);

    useEffect(() => {
        dispatch(getRestaurantThunk(id));
        dispatch(getListingsThunk({ restaurantId: id, page: 1, perPage: 10 }));
        dispatch(fetchCart());
    }, [dispatch, id]);

    useEffect(() => {
        if (restaurant?.id) {
            dispatch(getRestaurantBadgesThunk({
                restaurantId: Number(restaurant.id)
            }));
        }
    }, [restaurant?.id, dispatch]);

    const handleToggleDeliveryMethod = (newIsPickup) => {
        dispatch({ type: 'restaurant/setDeliveryMethod', payload: newIsPickup });
    };

    const getDisplayPrice = (item) => {
        return isPickup ? item.pick_up_price : item.delivery_price;
    };

    const getFreshScoreColor = (score) => {
        if (score >= 80) return '#059669';
        if (score >= 50) return '#F59E0B';
        return '#DC2626';
    };

    const formatWorkingHours = (start, end) => {
        return `${start} - ${end}`;
    };

    const handleAddToCart = async (item) => {
        const existingCartItems = cart.cartItems;
        const cartItem = cart.cartItems.find(
            (cartItem) => cartItem.listing_id === item.id
        );
        const countInCart = cartItem ? cartItem.count : 0;

        if (existingCartItems.length > 0) {
            const existingRestaurantId = existingCartItems[0].restaurant_id;
            if (existingRestaurantId !== item.restaurant_id) {
                alert('You can only add items from the same restaurant to your cart.');
                return;
            }
        }

        if (countInCart >= item.count) {
            alert('Maximum quantity reached for this item');
            return;
        }

        if (countInCart === 0) {
            dispatch(addItemToCart({payload: {listing_id: item.id}}));
        } else {
            dispatch(updateCartItem({payload: {listing_id: item.id, count: countInCart + 1}}));
        }
    };

    const handleRemoveFromCart = (item) => {
        const cartItem = cart.cartItems.find(
            (cartItem) => cartItem.listing_id === item.id
        );
        const countInCart = cartItem ? cartItem.count : 0;

        if (countInCart === 1) {
            dispatch(removeItemFromCart({listing_id: item.id}));
        } else {
            dispatch(updateCartItem({payload: {listing_id: item.id, count: countInCart - 1}}));
        }
    };

    const handleListingDetailsClick = (listing) => {
        setSelectedListing(listing);
        document.body.classList.add('modal-open');
    };

    const handleCloseModal = () => {
        setSelectedListing(null);
        document.body.classList.remove('modal-open');
    };

    const [selectedListing, setSelectedListing] = useState(null);

    // Badge information
    const BADGE_INFO = {
        'fresh': {
            icon: 'bi-apple',
            name: 'Fresh Ingredients',
            color: '#50703C',
            description: 'Uses fresh, locally sourced ingredients',
            positive: true
        },
        'fast_delivery': {
            icon: 'bi-truck',
            name: 'Fast Delivery',
            color: '#50703C',
            description: 'Quick delivery times, usually under 30 minutes',
            positive: true
        },
        'customer_friendly': {
            icon: 'bi-emoji-smile',
            name: 'Customer Friendly',
            color: '#50703C',
            description: 'Known for exceptional customer service',
            positive: true
        },
        'eco_friendly': {
            icon: 'bi-leaf',
            name: 'Eco Friendly',
            color: '#50703C',
            description: 'Uses sustainable practices and eco-friendly packaging',
            positive: true
        },
        'best_value': {
            icon: 'bi-currency-dollar',
            name: 'Best Value',
            color: '#50703C',
            description: 'Great quality food at competitive prices',
            positive: true
        },
        'not_fresh': {
            icon: 'bi-x-circle',
            name: 'Not Fresh',
            color: '#D32F2F',
            description: 'Food quality may be inconsistent or below expectations',
            positive: false
        },
        'slow_delivery': {
            icon: 'bi-hourglass',
            name: 'Slow Delivery',
            color: '#D32F2F',
            description: 'Delivery times may be longer than average',
            positive: false
        },
        'not_customer_friendly': {
            icon: 'bi-emoji-frown',
            name: 'Poor Service',
            color: '#D32F2F',
            description: 'Customer service may be inconsistent or below expectations',
            positive: false
        }
    };

    const LOCKED_BADGES = [
        {
            icon: 'bi-lock',
            name: 'Locked Badge',
            color: '#CCCCCC'
        },
        {
            icon: 'bi-lock',
            name: 'Locked Badge',
            color: '#CCCCCC'
        },
        {
            icon: 'bi-lock',
            name: 'Locked Badge',
            color: '#CCCCCC'
        }
    ];

    if (loading || !restaurant) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="restaurant-detail-container">
            {/* Restaurant header */}
            <div className="restaurant-header-container">
                <div className="restaurant-image-container">
                    {restaurant.image_url ? (
                        <img
                            src={restaurant.image_url}
                            alt={restaurant.restaurantName}
                            className="restaurant-image"
                        />
                    ) : (
                        <div className="no-image-container">
                            <i className="bi bi-shop fs-1 text-secondary"></i>
                            <p>No image available</p>
                        </div>
                    )}
                    <div className="image-overlay"></div>
                    <button onClick={() => navigate(-1)} className="back-button">
                        <i className="bi bi-arrow-left"></i>
                    </button>
                </div>

                <div className="restaurant-info-section">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-start">
                            <h1 className="restaurant-name">{restaurant.restaurantName}</h1>
                            <button className="info-button" onClick={() => setShowInfoModal(true)}>
                                <i className="bi bi-info-circle"></i>
                            </button>
                        </div>

                        <div className="restaurant-meta d-flex flex-wrap align-items-center mb-3">
                            <div className="rating-box me-2">
                                <i className="bi bi-star-fill text-warning"></i>
                                <span className="rating-text ms-1">{(restaurant.rating || 0).toFixed(1)}</span>
                                <span className="rating-count ms-1">({restaurant.ratingCount || 0}+)</span>
                            </div>
                            <div className="distance-box">
                                <span>{(restaurant.distance_km || 0).toFixed(1)} km</span>
                            </div>
                            <Link to={`/restaurant/${id}/comments`} className="comments-button ms-auto">
                                <i className="bi bi-chat-dots"></i>
                                <span className="ms-1">Comments</span>
                            </Link>
                        </div>

                        <div className="row badges-toggle-row">
                            <div className="col-lg-8 col-md-8 col-12">
                                {/* Badges */}
                                <div className="badges-container">
                                    {badges.length > 0 ? (
                                        <div className="badges-list d-flex flex-wrap">
                                            {badges.map((badge, index) => {
                                                const badgeInfo = BADGE_INFO[badge] || {
                                                    icon: 'bi-award',
                                                    name: badge,
                                                    color: '#666666',
                                                    positive: true
                                                };

                                                return (
                                                    <div
                                                        key={index}
                                                        className="badge-item"
                                                        onClick={() => {
                                                            setSelectedBadge(badge);
                                                            setShowBadgeModal(true);
                                                        }}
                                                    >
                                                        <div
                                                            className="badge-icon"
                                                            style={{
                                                                backgroundColor: badgeInfo.positive ? '#50703C' : '#D32F2F'
                                                            }}
                                                        >
                                                            <i className={`bi ${badgeInfo.icon} text-white`}></i>
                                                        </div>
                                                        <span
                                                            className="badge-name"
                                                            style={{
                                                                color: badgeInfo.positive ? '#333333' : '#D32F2F'
                                                            }}
                                                        >
                                                            {badgeInfo.name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="empty-badges-container d-flex">
                                            {LOCKED_BADGES.map((badge, index) => (
                                                <div key={index} className="badge-item">
                                                    <div
                                                        className="badge-icon"
                                                        style={{
                                                            backgroundColor: badge.color
                                                        }}
                                                    >
                                                        <i className={`bi ${badge.icon} text-white`}></i>
                                                    </div>
                                                    <span className="badge-name text-muted">{badge.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-12">
                                {/* Pickup/Delivery Toggle */}
                                <div className="pickup-delivery-toggle">
                                    {restaurant.pickup && restaurant.delivery ? (
                                        <div className="btn-group w-100">
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
                                        <button
                                            className="btn btn-dark w-100"
                                            disabled
                                        >
                                            {restaurant.pickup ? 'Pick Up Only' : 'Delivery Only'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="container">
                {/* Menu/Listings */}
                <div className="menu-section mt-4 pb-5">
                    <h2 className="section-title">Menu</h2>

                    {listings.length > 0 ? (
                        <div className="row menu-grid">
                            {listings.map((listing) => {
                                const displayPrice = getDisplayPrice(listing);
                                const cartItem = cart.cartItems.find(
                                    (cartItem) => cartItem.listing_id === listing.id
                                );
                                const countInCart = cartItem ? cartItem.count : 0;
                                const discountPercentage = listing.original_price ?
                                    Math.round(((listing.original_price - displayPrice) / listing.original_price) * 100) : 0;

                                return (
                                    <div className="col-lg-6 col-md-6 col-12 mb-4" key={listing.id}>
                                        <div className="menu-item" onClick={() => handleListingDetailsClick(listing)}>
                                            <div className="menu-item-image-container">
                                                <img
                                                    src={listing.image_url}
                                                    alt={listing.title}
                                                    className="menu-item-image"
                                                />
                                                <div
                                                    className="fresh-score-badge"
                                                    style={{
                                                        backgroundColor: getFreshScoreColor(listing.fresh_score) === '#059669' ?
                                                            '#ECFDF5' : getFreshScoreColor(listing.fresh_score) === '#F59E0B' ?
                                                                '#FEF3C7' : '#FEE2E2',
                                                        borderColor: getFreshScoreColor(listing.fresh_score)
                                                    }}
                                                >
                                                    <i
                                                        className="bi bi-leaf"
                                                        style={{color: getFreshScoreColor(listing.fresh_score)}}
                                                    ></i>
                                                    <span
                                                        style={{color: getFreshScoreColor(listing.fresh_score)}}
                                                    >
                                                        {Math.round(listing.fresh_score)}% Fresh
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="menu-item-content">
                                                <h3 className="menu-item-title">{listing.title}</h3>
                                                <div className="menu-item-price-cart">
                                                    <div className="menu-item-pricing">
                                                        {listing.original_price > displayPrice && (
                                                            <span className="original-price">
                                                                {listing.original_price} TL
                                                            </span>
                                                        )}
                                                        <span className="current-price">
                                                            {displayPrice} TL
                                                        </span>
                                                        {listing.original_price > displayPrice && (
                                                            <span className="discount-badge">
                                                                Save {discountPercentage}%
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="menu-item-cart" onClick={(e) => e.stopPropagation()}>
                                                        {countInCart > 0 ? (
                                                            <div className="cart-controls">
                                                                <button
                                                                    className="cart-btn minus-btn"
                                                                    onClick={() => handleRemoveFromCart(listing)}
                                                                >
                                                                    <i className="bi bi-dash"></i>
                                                                </button>
                                                                <span className="cart-count">{countInCart}</span>
                                                                <button
                                                                    className="cart-btn plus-btn"
                                                                    onClick={() => handleAddToCart(listing)}
                                                                >
                                                                    <i className="bi bi-plus"></i>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="add-to-cart-btn"
                                                                onClick={() => handleAddToCart(listing)}
                                                            >
                                                                <i className="bi bi-plus"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-menu-message">
                            <p>No menu items available at the moment. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart bar at bottom of screen */}
            {cart.cartItems.length > 0 && (
                <div className="cart-bar">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="cart-info">
                                <span className="cart-count-badge">
                                    {cart.cartItems.reduce((total, item) => total + item.count, 0)} items
                                </span>
                                <span className="cart-total">
                                    {cart.cartItems.reduce((total, item) => {
                                        const listing = listings.find(l => l.id === item.listing_id);
                                        if (!listing) return total;
                                        return total + (getDisplayPrice(listing) * item.count);
                                    }, 0).toFixed(2)} TL
                                </span>
                            </div>
                            <Link to="/cart" className="view-cart-btn">
                                View Cart <i className="bi bi-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Restaurant Info Modal */}
            {showInfoModal && (
                <div className="modal-overlay" onClick={() => setShowInfoModal(false)}>
                    <div className="info-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Restaurant Info</h4>
                            <button className="close-btn" onClick={() => setShowInfoModal(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="restaurant-description">
                                {restaurant.restaurantDescription || "No description available."}
                            </p>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Category:</span>
                                    <span className="info-value">{restaurant.category || "N/A"}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Working Hours:</span>
                                    <span className="info-value">
                                        {formatWorkingHours(
                                            restaurant.workingHoursStart || "",
                                            restaurant.workingHoursEnd || ""
                                        )}
                                    </span>
                                </div>
                                {restaurant.delivery && (
                                    <div className="info-item">
                                        <span className="info-label">Delivery Fee:</span>
                                        <span className="info-value">{`${restaurant.deliveryFee || 0} TL`}</span>
                                    </div>
                                )}
                                <div className="info-item">
                                    <span className="info-label">Delivery:</span>
                                    <span className="info-value">{restaurant.delivery ? "Available" : "Not available"}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Pickup:</span>
                                    <span className="info-value">{restaurant.pickup ? "Available" : "Not available"}</span>
                                </div>
                            </div>

                            <div className="map-section mt-4">
                                <h5>Location</h5>
                                <div className="map-placeholder">
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&z=15&output=embed`}
                                        width="100%"
                                        height="300"
                                        frameBorder="0"
                                        style={{border:0}}
                                        allowFullScreen=""
                                        aria-hidden="false"
                                        tabIndex="0"
                                    ></iframe>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="directions-btn mt-3"
                                >
                                    <i className="bi bi-map me-2"></i>
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Badge Modal */}
            {showBadgeModal && selectedBadge && (
                <div className="modal-overlay" onClick={() => setShowBadgeModal(false)}>
                    <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
                        {(() => {
                            const badgeInfo = BADGE_INFO[selectedBadge] || {
                                icon: 'bi-award',
                                name: selectedBadge,
                                color: '#666666',
                                description: 'No description available',
                                positive: true
                            };

                            return (
                                <>
                                    <div
                                        className="badge-icon-large"
                                        style={{
                                            backgroundColor: badgeInfo.color + '20'
                                        }}
                                    >
                                        <i
                                            className={`bi ${badgeInfo.icon}`}
                                            style={{color: badgeInfo.color, fontSize: '2rem'}}
                                        ></i>
                                    </div>
                                    <h3 className="badge-modal-title">{badgeInfo.name}</h3>
                                    <p className="badge-modal-description">{badgeInfo.description}</p>
                                    <button
                                        className="close-badge-btn"
                                        style={{backgroundColor: badgeInfo.color}}
                                        onClick={() => setShowBadgeModal(false)}
                                    >
                                        Close
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Listing Detail Modal */}
            {selectedListing && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="listing-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={handleCloseModal}>
                            <i className="bi bi-x-lg"></i>
                        </button>

                        <div className="listing-modal-image">
                            <img
                                src={selectedListing.image_url}
                                alt={selectedListing.title}
                            />
                        </div>

                        <div className="listing-modal-content">
                            <h2 className="listing-modal-title">{selectedListing.title}</h2>

                            <div
                                className="fresh-score-badge-large"
                                style={{
                                    backgroundColor: getFreshScoreColor(selectedListing.fresh_score) === '#059669' ?
                                        '#ECFDF5' : getFreshScoreColor(selectedListing.fresh_score) === '#F59E0B' ?
                                            '#FEF3C7' : '#FEE2E2',
                                    borderColor: getFreshScoreColor(selectedListing.fresh_score)
                                }}
                            >
                                <i
                                    className="bi bi-leaf"
                                    style={{color: getFreshScoreColor(selectedListing.fresh_score)}}
                                ></i>
                                <span style={{color: getFreshScoreColor(selectedListing.fresh_score)}}>
                                    {Math.round(selectedListing.fresh_score)}% Fresh
                                </span>
                            </div>

                            <div className="consume-within-box">
                                <i className="bi bi-clock text-danger"></i>
                                <div className="consume-info">
                                    <span className="consume-text">
                                        Consume within {selectedListing.consume_within} days
                                    </span>
                                    <span className="expiry-date">
                                        Before {format(addDays(new Date(), selectedListing.consume_within || 1), 'MMM dd, yyyy')}
                                    </span>
                                </div>
                            </div>

                            <div className="listing-price-section">
                                {(() => {
                                    const displayPrice = getDisplayPrice(selectedListing);
                                    const discountPercentage = selectedListing.original_price ?
                                        Math.round(((selectedListing.original_price - displayPrice) / selectedListing.original_price) * 100) : 0;

                                    return (
                                        <>
                                            {selectedListing.original_price && displayPrice && discountPercentage > 0 && (
                                                <div className="savings-badge">
                                                    Save {discountPercentage}%
                                                </div>
                                            )}
                                            {selectedListing.original_price && (
                                                <span className="original-price-large">
                                                    {selectedListing.original_price} TL
                                                </span>
                                            )}
                                            <span className="current-price-large">
                                                {displayPrice} TL
                                            </span>
                                        </>
                                    );
                                })()}
                            </div>

                            <p className="listing-description">
                                {selectedListing.description}
                            </p>

                            <div className="modal-cart-section">
                                {(() => {
                                    const cartItem = cart.cartItems.find(
                                        (item) => item.listing_id === selectedListing.id
                                    );
                                    const countInCart = cartItem ? cartItem.count : 0;

                                    return (
                                        <>
                                            {countInCart > 0 ? (
                                                <div className="cart-controls-large">
                                                    <button
                                                        className="cart-btn-large"
                                                        onClick={() => handleRemoveFromCart(selectedListing)}
                                                    >
                                                        <i className="bi bi-dash"></i>
                                                    </button>
                                                    <span className="cart-count-large">{countInCart}</span>
                                                    <button
                                                        className="cart-btn-large"
                                                        onClick={() => handleAddToCart(selectedListing)}
                                                    >
                                                        <i className="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="add-to-cart-btn-large"
                                                    onClick={() => handleAddToCart(selectedListing)}
                                                >
                                                    Add to Cart
                                                    <span className="ms-2">{getDisplayPrice(selectedListing)} TL</span>
                                                </button>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* Restaurant Details Styles */
                .restaurant-detail-container {
                    padding-bottom: 70px;
                }
                
                /* Restaurant Header */
                .restaurant-header-container {
                    position: relative;
                    background-color: white;
                    z-index: 10;
                }
                
                .restaurant-image-container {
                    height: 250px;
                    position: relative;
                    background-color: #f5f5f5;
                }
                
                .restaurant-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .no-image-container {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: #666;
                }
                
                .image-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 50%;
                    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
                }
                
                .back-button {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    background-color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    cursor: pointer;
                    z-index: 5;
                }
                
                .restaurant-info-section {
                    background-color: white;
                    border-top-left-radius: 24px;
                    border-top-right-radius: 24px;
                    margin-top: -24px;
                    position: relative;
                    padding: 24px 0 16px;
                }
                
                .restaurant-name {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: #333;
                }
                
                .info-button {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    background-color: #f5f5f5;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    color: #666;
                    margin-left: 12px;
                }
                
                .restaurant-meta {
                    margin-bottom: 16px;
                }
                
                .rating-box {
                    background-color: #f8f8f8;
                    padding: 6px 12px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                }
                
                .rating-text {
                    font-weight: 600;
                    color: #333;
                }
                
                .rating-count {
                    color: #666;
                    font-size: 14px;
                }
                
                .distance-box {
                    background-color: #f8f8f8;
                    padding: 6px 12px;
                    border-radius: 16px;
                    font-size: 14px;
                    color: #666;
                }
                
                .comments-button {
                    display: flex;
                    align-items: center;
                    background-color: #f8f8f8;
                    padding: 6px 12px;
                    border-radius: 16px;
                    color: #666;
                    text-decoration: none;
                    font-size: 14px;
                }
                
                .badges-toggle-row {
                    margin-top: 16px;
                }
                
                /* Badges Styles */
                .badges-container {
                    margin-bottom: 16px;
                }
                
                .badges-list {
                    gap: 12px;
                }
                
                .badge-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 70px;
                    cursor: pointer;
                }
                
                .badge-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 4px;
                }
                
                .badge-name {
                    font-size: 12px;
                    text-align: center;
                    line-height: 1.2;
                }
                
                .empty-badges-container {
                    gap: 12px;
                }
                
                /* Pickup/Delivery Toggle */
                .pickup-delivery-toggle {
                    margin-bottom: 16px;
                }
                
                /* Menu Section */
                .menu-section {
                    margin-top: 20px;
                }
                
                .section-title {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: #333;
                }
                
                .menu-grid {
                    margin-top: 16px;
                }
                
                .menu-item {
                    background-color: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    height: 100%;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.3s;
                }
                
                .menu-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                }
                
                .menu-item-image-container {
                    position: relative;
                    height: 180px;
                }
                
                .menu-item-image {
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
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    border-width: 1px;
                    border-style: solid;
                }
                
                .menu-item-content {
                    padding: 16px;
                }
                
                .menu-item-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: #333;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    height: 48px;
                }
                
                .menu-item-price-cart {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .menu-item-pricing {
                    display: flex;
                    flex-direction: column;
                }
                
                .original-price {
                    text-decoration: line-through;
                    color: #999;
                    font-size: 14px;
                }
                
                .current-price {
                    font-size: 18px;
                    font-weight: 700;
                    color: #059669;
                }
                
                .discount-badge {
                    display: inline-block;
                    background-color: #ECFDF5;
                    color: #059669;
                    font-size: 12px;
                    font-weight: 600;
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-top: 4px;
                }
                
                .menu-item-cart {
                    display: flex;
                    align-items: center;
                }
                
                .cart-controls {
                    display: flex;
                    align-items: center;
                    background-color: #f8f8f8;
                    border-radius: 8px;
                    padding: 2px;
                }
                
                .cart-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    background-color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                
                .minus-btn {
                    color: #DC2626;
                }
                
                .plus-btn {
                    color: #059669;
                }
                
                .cart-count {
                    font-weight: 600;
                    color: #333;
                    margin: 0 8px;
                    min-width: 20px;
                    text-align: center;
                }
                
                .add-to-cart-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    background-color: #f8f8f8;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #059669;
                    font-size: 18px;
                    cursor: pointer;
                }
                
                .empty-menu-message {
                    text-align: center;
                    padding: 40px 20px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    color: #666;
                }
                
                /* Cart Bar */
                .cart-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: #333;
                    color: white;
                    padding: 16px 0;
                    z-index: 1000;
                }
                
                .cart-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .cart-count-badge {
                    font-size: 14px;
                    opacity: 0.8;
                }
                
                .cart-total {
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .view-cart-btn {
                    background-color: #059669;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                }
                
                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    padding: 20px;
                }
                
                /* Info Modal */
                .info-modal {
                    width: 100%;
                    max-width: 600px;
                    max-height: 90vh;
                    background-color: white;
                    border-radius: 16px;
                    overflow-y: auto;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid #eee;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #666;
                }
                
                .modal-body {
                    padding: 20px;
                }
                
                .restaurant-description {
                    margin-bottom: 20px;
                    line-height: 1.6;
                    color: #555;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 12px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #666;
                    font-size: 14px;
                }
                
                .info-value {
                    color: #333;
                    font-weight: 500;
                }
                
                .map-section {
                    margin-top: 20px;
                }
                
                .map-placeholder {
                    width: 100%;
                    height: 300px;
                    background-color: #f5f5f5;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .directions-btn {
                    display: block;
                    text-align: center;
                    background-color: #333;
                    color: white;
                    text-decoration: none;
                    padding: 10px;
                    border-radius: 8px;
                    margin-top: 16px;
                }
                
                /* Badge Modal */
                .badge-modal {
                    background-color: white;
                    border-radius: 16px;
                    padding: 24px;
                    width: 100%;
                    max-width: 400px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                
                .badge-icon-large {
                    width: 80px;
                    height: 80px;
                    border-radius: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                }
                
                .badge-modal-title {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: #333;
                }
                
                .badge-modal-description {
                    font-size: 16px;
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                
                .close-badge-btn {
                    padding: 10px 24px;
                    border-radius: 8px;
                    border: none;
                    color: white;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                }
                
                /* Listing Detail Modal */
                .listing-detail-modal {
                    background-color: white;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 700px;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                }
                
                .close-modal-btn {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    background-color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    cursor: pointer;
                    z-index: 5;
                }
                
                .listing-modal-image {
                    height: 300px;
                    width: 100%;
                }
                
                .listing-modal-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .listing-modal-content {
                    padding: 24px;
                }
                
                .listing-modal-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 16px;
                }
                
                .fresh-score-badge-large {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    border-width: 1px;
                    border-style: solid;
                }
                
                .consume-within-box {
                    display: flex;
                    gap: 12px;
                    padding: 16px;
                    background-color: #FEE2E2;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    color: #DC2626;
                    align-items: center;
                }
                
                .consume-within-box i {
                    font-size: 24px;
                }
                
                .consume-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .consume-text {
                    font-weight: 600;
                    font-size: 16px;
                }
                
                .expiry-date {
                    font-size: 14px;
                }
                
                .listing-price-section {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                
                .savings-badge {
                    padding: 8px 16px;
                    background-color: #ECFDF5;
                    color: #059669;
                    font-weight: 600;
                    border-radius: 8px;
                    border: 1px solid #059669;
                }
                
                .original-price-large {
                    font-size: 18px;
                    text-decoration: line-through;
                    color: #999;
                }
                
                .current-price-large {
                    font-size: 28px;
                    font-weight: 700;
                    color: #059669;
                }
                
                .listing-description {
                    margin-bottom: 24px;
                    line-height: 1.6;
                    color: #555;
                }
                
                .modal-cart-section {
                    margin-top: 16px;
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                }
                
                .cart-controls-large {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f8f8f8;
                    border-radius: 12px;
                    padding: 4px;
                }
                
                .cart-btn-large {
                    width: 48px;
                    height: 48px;
                    border-radius: 10px;
                    background-color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    cursor: pointer;
                }
                
                .cart-count-large {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin: 0 16px;
                    min-width: 30px;
                    text-align: center;
                }
                
                .add-to-cart-btn-large {
                    width: 100%;
                    background-color: #059669;
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: 600;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                }
                
                @media (max-width: 768px) {
                    .restaurant-name {
                        font-size: 24px;
                    }
                    
                    .comments-button {
                        margin-top: 8px;
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .badge-item {
                        width: 60px;
                    }
                    
                    .pickup-delivery-toggle {
                        margin-top: 16px;
                    }
                    
                    .menu-item-image-container {
                        height: 150px;
                    }
                }
            `}</style>
        </div>
    );
};

export default RestaurantDetails;