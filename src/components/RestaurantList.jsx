import React, { useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantsByProximity } from "@src/redux/thunks/restaurantThunks";
import { addFavoriteThunk, removeFavoriteThunk, getFavoritesThunk } from "@src/redux/thunks/userThunks";
import { tokenService } from "@src/services/tokenService.js";
import CategoryFilter from "./CategoryFilter";
import { isRestaurantOpen } from "@src/utils/RestaurantFilters.js";
import { useRestaurantFilter } from "@src/context/RestaurantFilterContext";

function RestaurantList() {
    const dispatch = useDispatch();
    const restaurants = useSelector((state) => state.restaurant.restaurantsProximity);
    const loading = useSelector((state) => state.restaurant.restaurantsProximityLoading);
    const favoriteRestaurantsIDs = useSelector((state) => state.restaurant.favoriteRestaurantsIDs || []);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const { showClosedRestaurants } = useRestaurantFilter();

    useEffect(() => {
        dispatch(getRestaurantsByProximity());
        dispatch(getFavoritesThunk());
    }, [dispatch]);

    const handleFavoritePress = useCallback((event, id) => {
        event.preventDefault();
        event.stopPropagation();

        const token = tokenService.getToken();
        if (!token) {
            console.error('Authentication token is missing.');
            return;
        }

        if (favoriteRestaurantsIDs.includes(id)) {
            dispatch(removeFavoriteThunk({restaurant_id: id}));
        } else {
            dispatch(addFavoriteThunk({restaurant_id: id}));
        }
    }, [dispatch, favoriteRestaurantsIDs]);

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };

    const filteredRestaurants = restaurants
        ?.filter(restaurant => {
            if (selectedCategory !== "All Categories" &&
                restaurant.category !== selectedCategory &&
                restaurant.categoryName !== selectedCategory) {
                return false;
            }

            if (!showClosedRestaurants) {
                const isOpen = isRestaurantOpen(
                    restaurant.workingDays,
                    restaurant.workingHoursStart,
                    restaurant.workingHoursEnd
                );
                if (!isOpen) {
                    return false;
                }
            }

            return true;
        }) || [];

    console.log(`Total restaurants in store: ${restaurants?.length || 0}`);
    console.log(`Filtered restaurants: ${filteredRestaurants?.length || 0}`);
    console.log("All restaurants:", restaurants);

    if (loading) {
        return (
            <div className="text-center my-4" data-testid="restaurant-list-root">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!restaurants || restaurants.length === 0) {
        return (
            <div className="no-restaurants my-4" data-testid="restaurant-list-root">
                <p>No restaurants found in your area.</p>
                <p>Try changing your delivery address or check back later.</p>
            </div>
        );
    }

    return (
        <div className="restaurant-list" data-testid="restaurant-list-root">
            <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
            />

            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0"><strong>{filteredRestaurants.length}</strong> restaurants found</p>
            </div>

            {filteredRestaurants.length === 0 ? (
                <div className="alert alert-info my-4">
                    No restaurants found in the {selectedCategory} category. Try selecting a different category or check the "Show closed" filter.
                </div>
            ) : (
                <div className="row">
                    {filteredRestaurants.map((restaurant) => {
                        const isFavorite = favoriteRestaurantsIDs.includes(restaurant.id);
                        const isOpen = isRestaurantOpen(
                            restaurant.workingDays,
                            restaurant.workingHoursStart,
                            restaurant.workingHoursEnd
                        );
                        const hasStock = restaurant.listings > 0;
                        const isDisabled = !isOpen || !hasStock;

                        return (
                            <div className="col-md-4 mb-4" key={restaurant.id}>
                                <Link
                                    to={`/Restaurant/${restaurant.id}`}
                                    className="restaurant-card"
                                    style={{ pointerEvents: 'auto' }}
                                >
                                    <div className="card h-100">
                                        <div className="card-img-container">
                                            <img
                                                src={restaurant.image_url || 'https://via.placeholder.com/300x200?text=Restaurant'}
                                                className="card-img-top"
                                                alt={restaurant.restaurantName}
                                            />
                                            {restaurant.category && (
                                                <span className="category-badge">{restaurant.category || restaurant.categoryName}</span>
                                            )}
                                            {isDisabled && (
                                                <span className="status-badge">
                                                    {!isOpen ? 'Closed' : !hasStock ? 'Out of Stock' : ''}
                                                </span>
                                            )}
                                            <button
                                                className="favorite-btn"
                                                onClick={(e) => handleFavoritePress(e, restaurant.id)}
                                            >
                                                <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`}
                                                   style={{ color: isFavorite ? "#FF4081" : "#757575" }}
                                                ></i>
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            <div className="restaurant-header">
                                                <h5 className="card-title">{restaurant.restaurantName}</h5>
                                                <div className="rating-container">
                                                    <i className="bi bi-star-fill"></i>
                                                    <span className="rating">{restaurant.rating ? restaurant.rating.toFixed(1) : '0.0'}</span>
                                                </div>
                                            </div>
                                            <p className="card-text restaurant-desc">{restaurant.restaurantDescription}</p>
                                            <div className="restaurant-info">
                                                <div className="info-item">
                                                    <i className="bi bi-geo-alt"></i>
                                                    <span>{restaurant.distance_km ? `${restaurant.distance_km.toFixed(1)} km away` : 'Distance unavailable'}</span>
                                                </div>
                                                {restaurant.delivery && (
                                                    <div className="info-item">
                                                        <i className="bi bi-truck"></i>
                                                        <span>{Math.round(15 + (restaurant.distance_km || 3) * 5)} min</span>
                                                    </div>
                                                )}
                                                {restaurant.pickup && (
                                                    <div className="info-item">
                                                        <i className="bi bi-bag"></i>
                                                        <span>Pickup</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="restaurant-footer">
                                                {restaurant.deliveryFee !== undefined && restaurant.delivery && (
                                                    <div className="footer-item">
                                                        <span className="footer-label">Delivery Fee:</span>
                                                        <span className="footer-value">
                                                            {restaurant.deliveryFee > 0 ? `${restaurant.deliveryFee.toFixed(2)} $` : 'Free'}
                                                        </span>
                                                    </div>
                                                )}
                                                {restaurant.minOrderAmount !== undefined && restaurant.minOrderAmount !== null && restaurant.delivery && (
                                                    <div className="footer-item">
                                                        <span className="footer-label">Min Order:</span>
                                                        <span className="footer-value">${restaurant.minOrderAmount.toFixed(2)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}

            <style jsx>{`
                .restaurant-card {
                    text-decoration: none;
                    color: inherit;
                    display: block;
                    transition: transform 0.2s, box-shadow 0.3s;
                }

                .restaurant-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }

                .card {
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    height: 100%;
                    border: none;
                    transition: all 0.3s ease;
                }

                .card-img-container {
                    position: relative;
                    overflow: hidden;
                }

                .card-img-top {
                    height: 180px;
                    object-fit: cover;
                    transition: transform 0.5s;
                }

                .restaurant-card:hover .card-img-top {
                    transform: scale(1.05);
                }

                .category-badge {
                    position: absolute;
                    left: 12px;
                    top: 12px;
                    background-color: rgba(80, 112, 60, 0.85);
                    padding: 6px 12px;
                    border-radius: 20px;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                    backdrop-filter: blur(2px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .favorite-btn {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background-color: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
                    cursor: pointer;
                    transition: all 0.2s;
                    z-index: 1;
                }

                .favorite-btn:hover {
                    background-color: #f8f9fa;
                    transform: scale(1.1);
                }

                .favorite-btn i {
                    font-size: 20px;
                }

                .restaurant-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .card-title {
                    font-weight: 700;
                    font-size: 18px;
                    margin-bottom: 0;
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .rating-container {
                    display: flex;
                    align-items: center;
                    background-color: #F0F9EB;
                    padding: 4px 8px;
                    border-radius: 12px;
                    gap: 4px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }

                .rating-container i {
                    color: #50703C;
                    font-size: 14px;
                }

                .rating {
                    font-weight: 600;
                    font-size: 14px;
                    color: #333;
                }

                .restaurant-desc {
                    color: #6B7280;
                    font-size: 14px;
                    margin-bottom: 12px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.4;
                }

                .restaurant-info {
                    display: flex;
                    flex-wrap: wrap;
                    margin: 8px 0;
                    gap: 12px;
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background-color: #f9f9f9;
                    padding: 4px 8px;
                    border-radius: 6px;
                }

                .info-item i {
                    color: #50703C;
                    font-size: 16px;
                }

                .info-item span {
                    font-size: 14px;
                    color: #4B5563;
                }

                .restaurant-footer {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid #F3F4F6;
                }

                .footer-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .footer-label {
                    font-size: 13px;
                    color: #6B7280;
                }

                .footer-value {
                    font-size: 13px;
                    font-weight: 600;
                    color: #50703C;
                }

                .no-restaurants {
                    text-align: center;
                    padding: 30px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }

                .status-badge {
                    position: absolute;
                    right: 12px;
                    bottom: 12px;
                    background-color: rgba(244, 67, 54, 0.85);
                    padding: 6px 12px;
                    border-radius: 20px;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                    backdrop-filter: blur(2px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}

export default RestaurantList;

