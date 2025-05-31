import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentRestaurantsThunk } from "../redux/thunks/restaurantThunks";
import { isRestaurantOpen } from "../utils/RestaurantFilters.js";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RecentRestaurants = () => {
    const dispatch = useDispatch();
    const { recentRestaurantIDs, recentRestaurantsLoading, restaurantsProximity } = useSelector(
        (state) => state.restaurant
    );
    const sliderRef = useRef(null);

    useEffect(() => {
        dispatch(getRecentRestaurantsThunk());
    }, [dispatch]);

    const recentRestaurants = restaurantsProximity.filter(restaurant =>
        recentRestaurantIDs.includes(restaurant.id)
    );

    if (recentRestaurantsLoading || !recentRestaurants || recentRestaurants.length === 0) {
        return null;
    }

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    const renderRecentItem = (item) => {
        const isOpen = isRestaurantOpen(item.workingDays, item.workingHoursStart, item.workingHoursEnd);
        const hasStock = item.listings > 0;
        const isDisabled = !isOpen || !hasStock;
        const overlayMessage = !isOpen
            ? 'Currently Closed'
            : !hasStock
                ? 'Out of Stock (Come back later!)'
                : '';

        return (
            <div key={`recent-${item.id}`} style={styles.recentCardContainer}>
                <Link
                    to={!isDisabled ? `/restaurant/${item.id}` : "#"}
                    className="text-decoration-none"
                    style={isDisabled ? {pointerEvents: 'none'} : {}}
                >
                    <div style={styles.recentCard} className="recent-card">
                        <div style={styles.recentImageContainer}>
                            {item.image_url ? (
                                <div style={{position: 'relative', height: '100%'}}>
                                    <img
                                        src={item.image_url}
                                        alt={item.restaurantName}
                                        style={styles.recentImage}
                                    />
                                    <div style={styles.gradientOverlay}></div>
                                </div>
                            ) : (
                                <div style={styles.recentNoImage}>
                                    <i className="bi bi-cup-hot fs-4 text-secondary"></i>
                                </div>
                            )}

                            <div style={styles.recentContent}>
                                <div style={styles.dateBadge}>
                                    <i className="bi bi-clock-history me-1"></i>
                                    <span>Recently Visited</span>
                                </div>
                                <h5 style={styles.recentName}>{item.restaurantName}</h5>
                                <div style={styles.recentDetails}>
                                    <span className="rating">
                                        <i className="bi bi-star-fill text-warning me-1"></i>
                                        {item.rating || "New"}
                                    </span>
                                    <span className="divider">•</span>
                                    <span className="restaurant-type">
                                        {item.categoryName || "Restaurant"}
                                    </span>
                                </div>
                                {isDisabled && (
                                    <div style={styles.disabledOverlay}>
                                        <span style={styles.disabledMessage}>{overlayMessage}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        );
    };

    return (
        <div className="recent-restaurants my-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="section-title">
                    <i className="bi bi-clock-history me-2 text-primary"></i>
                    Recently Visited
                </h3>
            </div>
            <div className="slider-container">
                <Slider ref={sliderRef} {...settings}>
                    {recentRestaurants.map(restaurant => renderRecentItem(restaurant))}
                </Slider>
            </div>

            <style jsx>{`
                .recent-restaurants {
                    margin-bottom: 40px;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-radius: 12px;
                }
                .section-title {
                    font-weight: 700;
                    font-size: 24px;
                    margin-bottom: 0;
                    display: flex;
                    align-items: center;
                }
                .slider-container {
                    padding: 10px 0;
                }
                .recent-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    margin: 0 15px;
                }
                .recent-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                }
                /* Override slick slider default styles */
                .slick-slide {
                    padding: 0 10px;
                }
                .slick-list {
                    margin: 0 -10px;
                }
            `}</style>
        </div>
    );
};

const styles = {
    recentCardContainer: {
        padding: '0',
        height: '220px',
    },
    recentCard: {
        borderRadius: '16px',
        overflow: 'hidden',
        height: '220px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        position: 'relative',
    },
    recentImageContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    recentImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    recentNoImage: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 100%)',
    },
    recentContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px',
    },
    recentName: {
        color: 'white',
        marginBottom: '6px',
        fontSize: '20px',
        fontWeight: '600',
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
    },
    recentDetails: {
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        gap: '2px',
    },
    dateBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgba(80, 112, 60, 0.9)',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        marginBottom: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    disabledOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
    },
    disabledMessage: {
        color: 'white',
        backgroundColor: 'rgba(80, 112, 60, 0.9)',
        padding: '8px 12px',
        borderRadius: '8px',
        fontWeight: '600',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    },
};

export default RecentRestaurants;

