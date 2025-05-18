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

    const debugRecents = async () => {
        try {
            const response = await dispatch(getRecentRestaurantsThunk()).unwrap();
            alert(`Recent Restaurants Response:\n${JSON.stringify(response, null, 2)}`);
        } catch (error) {
            alert(`Debug Error:\n${JSON.stringify(error, null, 2)}`);
        }
    };

    const debugState = () => {
        alert(`Current State:\nLoading: ${recentRestaurantsLoading}\nRecents: ${JSON.stringify(recentRestaurantIDs)}\nFiltered Restaurants: ${JSON.stringify(recentRestaurants.map(r => ({
            name: r.restaurantName,
            id: r.id
        })), null, 2)}`);
    };

    if (recentRestaurantsLoading || !recentRestaurants || recentRestaurants.length === 0) {
        return null;
    }

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
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
                    <div style={styles.recentCard}>
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
                <h3 className="fw-bold mb-0">Recently Visited</h3>
            </div>
            <Slider ref={sliderRef} {...settings}>
                {recentRestaurants.map(restaurant => renderRecentItem(restaurant))}
            </Slider>

            <style jsx>{`
                .recent-restaurants {
                    margin-bottom: 30px;
                }
            `}</style>
        </div>
    );
};

const styles = {
    recentCardContainer: {
        padding: '0 8px',
        height: '100%',
    },
    recentCard: {
        borderRadius: '16px',
        overflow: 'hidden',
        height: '180px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
    },
    recentContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
    },
    recentName: {
        color: 'white',
        marginBottom: '8px',
        fontSize: '18px',
        fontWeight: '600',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    },
    dateBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgba(80, 112, 60, 0.85)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        marginBottom: '8px',
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
    },
};

export default RecentRestaurants;