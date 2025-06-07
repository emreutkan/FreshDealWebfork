import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getRestaurantThunk, getListingsThunk, getRestaurantBadgesThunk } from "@src/redux/thunks/restaurantThunks.js";
import { addItemToCart, fetchCart, removeItemFromCart, updateCartItem, resetCart } from "@src/redux/thunks/cartThunks.js";
import { format, addDays } from 'date-fns';
import PunishmentHistorySection from "../components/PunishmentHistorySection";
import RestaurantDetailsMap from "../components/RestaurantDetailsMap";

const RestaurantDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [showPunishmentModal, setShowPunishmentModal] = useState(false);

    const restaurant = useSelector((state) => state.restaurant.selectedRestaurant);
    const listings = useSelector((state) => state.restaurant.selectedRestaurantListings);
    const loading = useSelector((state) => state.restaurant.listingsLoading);
    const cart = useSelector((state) => state.cart);
    const isPickup = useSelector((state) => state.restaurant.isPickup);
    const badges = useSelector((state) => state.restaurant.selectedRestaurant.badges || []);

    const userAddresses = useSelector((state) => state.address?.addresses || []);
    const primaryAddress = userAddresses.find(address => address.is_primary);
    const userLongitude = primaryAddress?.longitude || 0;
    const userLatitude = primaryAddress?.latitude || 0;
    const restaurantLongitude = restaurant?.longitude || 0;
    const restaurantLatitude = restaurant?.latitude || 0;

    const distance = Math.sqrt(
        Math.pow(restaurantLongitude - userLongitude, 2) +
        Math.pow(restaurantLatitude - userLatitude, 2)
    );
    const distanceInKm = distance * 111;

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
                const willClearCart = window.confirm(
                    'You can only add items from the same restaurant to your cart.\n\n' +
                    'Would you like to clear your current cart and add this new item?'
                );

                if (willClearCart) {
                    try {
                        await dispatch(resetCart());
                        // Wait a moment for the cart to be cleared then add the new item
                        setTimeout(() => {
                            dispatch(addItemToCart({payload: {listing_id: item.id}}));
                        }, 300);
                    } catch (error) {
                        console.error('Error resetting cart:', error);
                        alert('Could not clear your cart. Please try again.');
                    }
                }
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

    const renderBadges = () => {
        const displayBadges = badges.length > 0 ? badges : [];

        return displayBadges.length > 0 ? (
            <div className="badges-container">
                {displayBadges.map((badge) => {
                    const badgeInfo = BADGE_INFO[badge] || {
                        icon: 'bi-award',
                        name: badge,
                        color: '#666666',
                        positive: true
                    };

                    return (
                        <div
                            key={badge}
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
                                <i className={`bi ${badgeInfo.icon}`}></i>
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
            <div className="badges-container empty-badges">
                {LOCKED_BADGES.map((badge, index) => (
                    <div key={index} className="badge-item">
                        <div
                            className="badge-icon"
                            style={{
                                backgroundColor: badge.color
                            }}
                        >
                            <i className={`bi ${badge.icon}`}></i>
                        </div>
                        <span className="badge-name text-muted">
                            {badge.name}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

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
                        <div className="no-image">
                            <i className="bi bi-card-image"></i>
                            <span>No image available</span>
                        </div>
                    )}
                    <div className="image-gradient-overlay"></div>
                </div>

                <div className="restaurant-info-container">
                    <div className="restaurant-title-row">
                        <h1 className="restaurant-title">{restaurant.restaurantName}</h1>
                        <div className="action-buttons">
                            <button
                                className="warning-button"
                                onClick={() => setShowPunishmentModal(true)}
                                aria-label="Show punishment history"
                            >
                                <i className="bi bi-exclamation-circle"></i>
                            </button>
                            <button
                                className="info-button"
                                onClick={() => setShowInfoModal(true)}
                                aria-label="Show restaurant information"
                            >
                                <i className="bi bi-info-circle"></i>
                            </button>
                        </div>
                    </div>

                    <div className="restaurant-meta-info">
                        <div className="rating-box">
                            <i className="bi bi-star-fill text-warning"></i>
                            <span className="rating-value">{restaurant.rating ? restaurant.rating.toFixed(1) : 'New'}</span>
                            <span className="rating-count">({restaurant.ratingCount || 0}+)</span>
                        </div>

                        <div className="distance-box">
                            <span>{distanceInKm.toFixed(1)} km</span>
                        </div>

                        <button
                            className="comments-button"
                            onClick={() => navigate(`/RestaurantComments/${id}`)}
                        >
                            <i className="bi bi-chat"></i>
                            <span>Comments</span>
                        </button>
                    </div>

                    <div className="badges-section">
                        <div className="badges-row">
                            {renderBadges()}
                        </div>

                        <div className="delivery-toggle">
                            <div className="toggle-container">
                                <button
                                    className={`toggle-button ${!isPickup ? 'active' : ''}`}
                                    onClick={() => handleToggleDeliveryMethod(false)}
                                >
                                    <i className="bi bi-truck"></i>
                                    <span>Delivery</span>
                                </button>
                                <button
                                    className={`toggle-button ${isPickup ? 'active' : ''}`}
                                    onClick={() => handleToggleDeliveryMethod(true)}
                                >
                                    <i className="bi bi-bag"></i>
                                    <span>Pickup</span>
                                </button>
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
                                                {listing.image_url && (
                                                    <img
                                                        src={listing.image_url}
                                                        alt={listing.title}
                                                        className="menu-item-image"
                                                    />
                                                )}
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
                                                                    type="button"
                                                                    className="cart-btn minus-btn"
                                                                    onClick={() => handleRemoveFromCart(listing)}
                                                                >
                                                                    <i className="bi bi-dash"></i>
                                                                </button>
                                                                <span className="cart-count">{countInCart}</span>
                                                                <button
                                                                    type="button"
                                                                    className="cart-btn plus-btn"
                                                                    onClick={() => handleAddToCart(listing)}
                                                                >
                                                                    <i className="bi bi-plus"></i>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
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

            {/* Listing Detail Modal */}
            {selectedListing && (
                <>
                    <div className="modal-backdrop show listing-detail-modal-backdrop" onClick={handleCloseModal} />
                    <div className="listing-detail-modal">
                        <div className="listing-modal-header">
                            <h3>{selectedListing.title}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="listing-modal-body">
                            <div className="listing-image-container mb-3">
                                {selectedListing.image_url && (
                                    <img
                                        src={selectedListing.image_url}
                                        alt={selectedListing.title}
                                        className="listing-detail-image"
                                    />
                                )}
                            </div>
                            <div className="listing-detail-info">
                                <div className="mb-3">
                                    <div className="fresh-score-badge detail-badge mb-2"
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
                                        <span
                                            style={{color: getFreshScoreColor(selectedListing.fresh_score)}}
                                        >
                                            {Math.round(selectedListing.fresh_score)}% Fresh
                                        </span>
                                    </div>
                                    <div className="quantity-badge detail-badge">
                                        <i className="bi bi-box"></i>
                                        <span>Available: {selectedListing.count}</span>
                                    </div>
                                </div>
                                <p className="listing-description">{selectedListing.description}</p>
                                <div className="listing-attributes">
                                    <div className="attribute-item">
                                        <span className="attribute-label">Best Before:</span>
                                        <span className="attribute-value">
                                            {(() => {
                                                if (selectedListing.expires_at) {
                                                    const date = new Date(selectedListing.expires_at);
                                                    if (!isNaN(date.getTime())) {
                                                        return format(date, 'PP');
                                                    }
                                                }
                                                return 'Not specified';
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="listing-modal-footer">
                            <div className="modal-pricing">
                                <div className="pricing-container">
                                    {selectedListing.original_price > getDisplayPrice(selectedListing) && (
                                        <span className="original-price">
                                            {selectedListing.original_price} TL
                                        </span>
                                    )}
                                    <span className="current-price">
                                        {getDisplayPrice(selectedListing)} TL
                                    </span>
                                </div>
                            </div>
                            <div className="modal-actions">
                                {(() => {
                                    const cartItem = cart.cartItems.find(
                                        (item) => item.listing_id === selectedListing.id
                                    );
                                    const countInCart = cartItem ? cartItem.count : 0;

                                    if (countInCart > 0) {
                                        return (
                                            <div className="cart-controls modal-controls">
                                                <button
                                                    className="cart-btn minus-btn"
                                                    onClick={() => handleRemoveFromCart(selectedListing)}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>
                                                <span className="cart-count">{countInCart}</span>
                                                <button
                                                    className="cart-btn plus-btn"
                                                    onClick={() => handleAddToCart(selectedListing)}
                                                    disabled={countInCart >= selectedListing.count}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <button
                                            className="add-to-cart-modal-btn"
                                            onClick={() => handleAddToCart(selectedListing)}
                                        >
                                            Add to Cart
                                        </button>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Restaurant Info Modal */}
            {showInfoModal && (
                <div className="custom-modal">
                    <div className="modal-backdrop" onClick={() => setShowInfoModal(false)}></div>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Restaurant Info</h3>
                            <button className="close-button" onClick={() => setShowInfoModal(false)}>
                                Close
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="restaurant-details">
                                <p className="restaurant-description">
                                    {restaurant?.restaurantDescription || "No information available."}
                                </p>
                                <p className="restaurant-detail-item">
                                    <strong>Category:</strong> {restaurant?.category || "N/A"}
                                </p>
                                <p className="restaurant-detail-item">
                                    <strong>Working Hours:</strong> {
                                        formatWorkingHours(
                                            restaurant?.workingHoursStart || "",
                                            restaurant?.workingHoursEnd || ""
                                        )
                                    }
                                </p>
                                {restaurant?.delivery && (
                                    <p className="restaurant-detail-item">
                                        <strong>Delivery Fee:</strong> ${restaurant?.deliveryFee || 0}
                                    </p>
                                )}
                            </div>
                            <div className="restaurant-map-container">
                                <RestaurantDetailsMap restaurant={restaurant} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Badge Detail Modal */}
            {showBadgeModal && selectedBadge && (
                <div className="custom-modal badge-modal">
                    <div className="modal-backdrop" onClick={() => setShowBadgeModal(false)}></div>
                    <div className="badge-modal-content">
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
                                            backgroundColor: `${badgeInfo.color}20`
                                        }}
                                    >
                                        <i
                                            className={`bi ${badgeInfo.icon}`}
                                            style={{color: badgeInfo.color}}
                                        ></i>
                                    </div>
                                    <h3 className="badge-modal-title">{badgeInfo.name}</h3>
                                    <p className="badge-modal-description">{badgeInfo.description}</p>
                                    <button
                                        className="close-button-small"
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

            {/* Punishment History Modal */}
            {showPunishmentModal && (
                <div className="custom-modal">
                    <div className="modal-backdrop" onClick={() => setShowPunishmentModal(false)}></div>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Punishment History</h3>
                            <button className="close-button" onClick={() => setShowPunishmentModal(false)}>
                                Close
                            </button>
                        </div>
                        <div className="modal-body">
                            <PunishmentHistorySection restaurantId={restaurant.id} />
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .restaurant-detail-container {
                    padding-bottom: 80px;
                }
                
                /* Existing styles for the restaurant page */
                .restaurant-header-container {
                    position: relative;
                    margin-bottom: 2rem;
                }
                
                .restaurant-image-container {
                    position: relative;
                    width: 100%;
                    height: 240px;
                    background-color: #f5f5f5;
                    overflow: hidden;
                }
                
                .restaurant-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .no-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: #999;
                }
                
                .no-image i {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                
                .image-gradient-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%);
                }
                
                .restaurant-info-container {
                    padding: 1.5rem;
                    background-color: white;
                    border-radius: 1rem 1rem 0 0;
                    margin-top: -1.5rem;
                    position: relative;
                    box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
                }
                
                .restaurant-title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }
                
                .restaurant-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 0;
                    color: #333;
                    flex: 1;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .warning-button, .info-button {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    cursor: pointer;
                }
                
                .warning-button {
                    background-color: #FFEBEE;
                    color: #D32F2F;
                }
                
                .warning-button i {
                    font-size: 1.25rem;
                }
                
                .info-button {
                    background-color: #F5F5F5;
                    color: #666666;
                }
                
                .info-button i {
                    font-size: 1.25rem;
                }
                
                .restaurant-meta-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }
                
                .rating-box {
                    background-color: #f8f8f8;
                    padding: 6px 12px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                }
                
                .rating-value {
                    font-weight: 600;
                    margin-left: 0.5rem;
                    color: #333;
                }
                
                .rating-count {
                    color: #666;
                    font-size: 14px;
                    margin-left: 0.25rem;
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
                    gap: 0.5rem;
                    background-color: #f8f8f8;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 16px;
                    cursor: pointer;
                    color: #666;
                    font-size: 14px;
                }
                
                .badges-section {
                    display: flex;
                    margin-top: 1rem;
                }
                
                .badges-row {
                    width: 70%;
                }
                
                .delivery-toggle {
                    width: 30%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                
                .badges-container {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding: 0.5rem 0;
                    margin-bottom: 16px;
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
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    margin-bottom: 4px;
                }
                
                .badge-icon i {
                    font-size: 1.25rem;
                }
                
                .badge-name {
                    font-size: 12px;
                    text-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    line-height: 1.2;
                }
                
                .empty-badges {
                    opacity: 0.5;
                }
                
                .toggle-container {
                    display: flex;
                    background-color: #F5F5F5;
                    border-radius: 0.5rem;
                    overflow: hidden;
                }
                
                .toggle-button {
                    border: none;
                    background: transparent;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #666;
                }
                
                .toggle-button.active {
                    background-color: #059669;
                    color: white;
                }
                
                /* Menu section styles */
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
                    background-color: #f0f0f0;
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
                    position: relative;
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
                
                /* Cart bar styles */
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
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1040;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .listing-detail-modal-backdrop { /* Specific for listing detail modal */
                    background-color: rgba(0, 0, 0, 0.6); /* Darker */
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px); /* For Safari */
                    z-index: 1045; /* Ensures it's above general backdrop, below modal content */
                }
                
                .listing-detail-modal {
                    width: 90%;
                    max-width: 700px;
                    max-height: 90vh;
                    background-color: #FFFFFF; /* Solid white background */
                    opacity: 1;                /* Ensure full opacity */
                    border-radius: 16px;
                    overflow: hidden; 
                    display: flex;
                    flex-direction: column;
                    position: fixed; /* Changed for centering */
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1050; /* Above its own backdrop */
                }
                
                .listing-modal-header {
                    padding: 16px 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .listing-modal-header h3 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #666;
                }
                
                .listing-modal-body {
                    padding: 16px 20px;
                    flex: 1;
                    overflow-y: auto;
                    position: relative;
                }

                .listing-modal-body .fresh-score-badge.detail-badge {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    margin-right: 0;
                    z-index: 10;
                }
                
                .listing-image-container {
                    height: 250px;
                    background-color: #f0f0f0;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 16px;
                }
                
                .listing-detail-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .listing-detail-info {
                }

                .listing-detail-info > .mb-3 { 
                }
                
                .detail-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 14px;
                    margin-right: 10px;
                    border-width: 1px;
                    border-style: solid;
                }
                
                .listing-description {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333;
                    margin: 16px 0;
                }
                
                .listing-attributes {
                    background-color: #f9f9f9;
                    padding: 16px;
                    border-radius: 8px;
                }
                
                .attribute-item {
                    display: flex;
                    margin-bottom: 8px;
                }
                
                .attribute-label {
                    font-weight: 600;
                    width: 120px;
                    color: #555;
                }
                
                .listing-modal-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-pricing .current-price {
                    font-size: 20px;
                }
                
                .modal-controls {
                    background-color: #f0f0f0;
                    border-radius: 20px;
                    padding: 5px;
                }
                
                .add-to-cart-modal-btn {
                    background-color: #059669;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                
                .add-to-cart-modal-btn:hover {
                    background-color: #047857;
                }
                
                .custom-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1050;
                }
                
                .custom-modal .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1050;
                }

                .custom-modal .modal-content {
                    width: 90%;
                    max-width: 600px;
                    max-height: 85vh;
                    background-color: white;
                    border-radius: 16px;
                    overflow: hidden;
                    position: relative;
                    z-index: 1051;
                    display: flex;
                    flex-direction: column;
                }
                
                .custom-modal .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid #eee;
                }
                
                .custom-modal .modal-title {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0;
                }
                
                .custom-modal .close-button {
                    background-color: #f0f0f0;
                    color: #333;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                }
                
                .custom-modal .modal-body {
                    padding: 20px;
                    overflow-y: auto;
                    flex-grow: 1;
                }
                
                .restaurant-details {
                    margin-bottom: 1.5rem;
                }
                
                .restaurant-description {
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 16px;
                    color: #555;
                }
                
                .restaurant-detail-item {
                    margin-bottom: 0.75rem;
                    font-size: 16px;
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
                
                .restaurant-map-container {
                    height: 300px;
                    background-color: #f5f5f5;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .map-placeholder {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: #999;
                }
                
                .map-placeholder i {
                    font-size: 2rem;
                    margin-bottom: 1rem;
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
                
                .badge-modal .modal-content {
                     width: 320px;
                     max-width: 90%;
                     padding: 24px;
                     align-items: center;
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
                
                .badge-icon-large i {
                    font-size: 32px;
                }
                
                .badge-modal-title {
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    text-align: center;
                    color: #333;
                }
                
                .badge-modal-description {
                    font-size: 15px;
                    text-align: center;
                    margin-bottom: 20px;
                    color: #666;
                    line-height: 1.6;
                }
                
                .close-button-small {
                    padding: 10px 24px;
                    border-radius: 8px;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 16px;
                }
                
                .listing-image-modal {
                    height: 300px;
                    width: 100%;
                }
                
                .listing-image-modal img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
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
                    .restaurant-title {
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
                    
                    .badges-section {
                        flex-direction: column;
                    }
                    
                    .badges-row, .delivery-toggle {
                        width: 100%;
                    }
                    
                    .delivery-toggle {
                        margin-top: 16px;
                        justify-content: flex-start;
                    }
                    
                    .menu-item-image-container {
                        height: 150px;
                    }
                    
                    .restaurant-meta-info {
                        flex-wrap: wrap;
                    }
                }
            `}</style>
        </div>
    );
};

export default RestaurantDetails;

