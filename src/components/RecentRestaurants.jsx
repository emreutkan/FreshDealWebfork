import React, { useRef } from "react";
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
                                    <i className="bi bi-clock me-1"></i>
                                    <span>Recent</span>
                                </div>
                                <h5 style={styles.recentTitle}>{item.restaurantName}</h5>
                            </div>

                            {isDisabled && (
                                <div style={styles.disabledOverlay}>
                                    <span>{overlayMessage}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerContainer}>
                <div style={styles.headerLeft}>
                    <i className="bi bi-clock-history me-2 text-success"></i>
                    <h4 className="mb-0 fw-bold">Recent Orders</h4>
                </div>
                <div style={styles.headerRight}>
                    <button onClick={debugState} className="btn btn-sm btn-light me-2">
                        State
                    </button>
                    <button onClick={debugRecents} className="btn btn-sm btn-light me-2">
                        API
                    </button>
                    <i className="bi bi-chevron-right text-success fs-5"></i>
                </div>
            </div>

            <div style={styles.sliderContainer}>
                <Slider ref={sliderRef} {...settings}>
                    {recentRestaurants.map(restaurant => renderRecentItem(restaurant))}
                </Slider>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#FFFFFF',
        paddingBottom: '8px',
        marginBottom: '1rem',
        borderRadius: '0.25rem',
        boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
        padding: '1rem'
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center'
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center'
    },
    sliderContainer: {
        position: 'relative'
    },
    recentCardContainer: {
        padding: '0 8px'
    },
    recentCard: {
        height: '130px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        marginBottom: '15px'
    },
    recentImageContainer: {
        height: '100%',
        position: 'relative'
    },
    recentImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    recentNoImage: {
        height: '100%',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '60%',
        background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7))'
    },
    recentContent: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: '8px'
    },
    dateBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '2px 6px',
        borderRadius: '6px',
        marginBottom: '4px',
        gap: '4px',
        color: '#fff',
        fontSize: '12px',
        fontWeight: '600'
    },
    recentTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#fff',
        margin: 0,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    },
    disabledOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600'
    }
};

export default RecentRestaurants;