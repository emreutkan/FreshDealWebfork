import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const navigate = useNavigate();
    const favoriteRestaurantsIDs = useSelector((state) => state.restaurant.favoriteRestaurantsIDs);
    const restaurants = useSelector((state) => state.restaurant.restaurantsProximity);
    const loading = useSelector((state) => state.restaurant.restaurantsProximityLoading);

    const favoriteRestaurants = useMemo(() => {
        return restaurants.filter((restaurant) => favoriteRestaurantsIDs.includes(restaurant.id));
    }, [restaurants, favoriteRestaurantsIDs]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="loading-text">Loading your favorites...</p>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <div className="favorites-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <h1 className="title">Favorite Restaurants</h1>
                <div className="placeholder"></div>
            </div>

            <div className="container">
                {favoriteRestaurants && favoriteRestaurants.length > 0 ? (
                    <div className="list-container">
                        <div className="info-card">
                            <i className="bi bi-info-circle text-success"></i>
                            <p className="info-text">
                                Your favorite restaurants are shown here for quick access
                            </p>
                        </div>

                        <div className="restaurant-grid">
                            {favoriteRestaurants.map((restaurant) => (
                                <div className="restaurant-card" key={restaurant.id}>
                                    <Link to={`/restaurant/${restaurant.id}`} className="card-link">
                                        <div className="card">
                                            <div className="card-img-container">
                                                <img
                                                    src={restaurant.image_url || 'https://via.placeholder.com/300x200?text=Restaurant'}
                                                    alt={restaurant.restaurantName}
                                                    className="card-img"
                                                />
                                                {restaurant.category && (
                                                    <span className="category-badge">{restaurant.category}</span>
                                                )}
                                                <button className="favorite-btn active">
                                                    <i className="bi bi-heart-fill" style={{ color: "#FF4081" }}></i>
                                                </button>
                                            </div>

                                            <div className="card-body">
                                                <div className="restaurant-header">
                                                    <h5 className="restaurant-title">{restaurant.restaurantName}</h5>
                                                    <div className="rating-container">
                                                        <i className="bi bi-star-fill"></i>
                                                        <span className="rating">{restaurant.rating ? restaurant.rating.toFixed(1) : '0.0'}</span>
                                                    </div>
                                                </div>

                                                <p className="restaurant-desc">{restaurant.restaurantDescription}</p>

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

                                                    {restaurant.minOrderAmount !== undefined && restaurant.delivery && (
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
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="empty-container">
                        <div className="icon-container">
                            <i className="bi bi-heart"></i>
                        </div>
                        <h2 className="empty-title">No Favorites Yet</h2>
                        <p className="empty-text">
                            Start adding restaurants to your favorites by tapping the heart icon on restaurants you like
                        </p>
                        <div className="empty-hint-container">
                            <i className="bi bi-lightbulb"></i>
                            <p className="empty-hint-text">
                                Favorites make it easier to order from restaurants you love
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .favorites-container {
                    min-height: 100vh;
                    background-color: #FFFFFF;
                }
                
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #FFFFFF;
                }
                
                .loading-text {
                    margin-top: 16px;
                    font-size: 16px;
                    color: #50703C;
                    font-weight: 500;
                }
                
                .favorites-header {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    background-color: #FFFFFF;
                    border-bottom: 1px solid #F3F4F6;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                
                .back-button {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                }
                
                .title {
                    flex: 1;
                    text-align: center;
                    font-size: 20px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                }
                
                .placeholder {
                    width: 32px;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .list-container {
                    padding: 0 0 40px 0;
                }
                
                .info-card {
                    display: flex;
                    background-color: #F0F9EB;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 20px;
                    align-items: center;
                }
                
                .info-card i {
                    font-size: 20px;
                    margin-right: 12px;
                }
                
                .info-text {
                    flex: 1;
                    margin: 0;
                    font-size: 14px;
                    color: #50703C;
                    font-weight: 500;
                }
                
                .restaurant-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                
                .restaurant-card {
                    transition: transform 0.2s, box-shadow 0.3s;
                    height: 100%;
                }
                
                .card-link {
                    text-decoration: none;
                    color: inherit;
                    display: block;
                    height: 100%;
                }
                
                .card {
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    height: 100%;
                    border: none;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    background-color: #FFFFFF;
                }
                
                .restaurant-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                
                .card-img-container {
                    position: relative;
                    overflow: hidden;
                }
                
                .card-img {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                    transition: transform 0.5s;
                }
                
                .restaurant-card:hover .card-img {
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
                    transform: scale(1.1);
                }
                
                .favorite-btn i {
                    font-size: 20px;
                }
                
                .card-body {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                
                .restaurant-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .restaurant-title {
                    font-weight: 700;
                    font-size: 18px;
                    margin-bottom: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 70%;
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
                    margin-top: auto;
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
                
                .empty-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 70vh;
                    padding: 0 20px;
                    text-align: center;
                }
                
                .icon-container {
                    width: 120px;
                    height: 120px;
                    border-radius: 60px;
                    background-color: #F0F9EB;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 24px;
                    border: 2px solid #50703C;
                }
                
                .icon-container i {
                    font-size: 60px;
                    color: #50703C;
                }
                
                .empty-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 12px;
                }
                
                .empty-text {
                    font-size: 16px;
                    color: #4B5563;
                    line-height: 24px;
                    margin-bottom: 24px;
                    max-width: 500px;
                }
                
                .empty-hint-container {
                    display: flex;
                    align-items: center;
                    background-color: #F0F9EB;
                    border-radius: 12px;
                    padding: 16px;
                    max-width: 500px;
                }
                
                .empty-hint-container i {
                    font-size: 20px;
                    color: #50703C;
                    margin-right: 12px;
                }
                
                .empty-hint-text {
                    flex: 1;
                    margin: 0;
                    font-size: 14px;
                    color: #50703C;
                }
                
                @media (max-width: 768px) {
                    .restaurant-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .empty-container {
                        padding: 40px 20px;
                    }
                }
                
                @media (min-width: 769px) and (max-width: 1024px) {
                    .restaurant-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>
        </div>
    );
};

export default Favorites;