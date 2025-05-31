import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentRestaurantsThunk } from "../redux/thunks/restaurantThunks";
import { isRestaurantOpen } from "../utils/RestaurantFilters.js";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Define consistent card sizing (similar to mobile)
const CARD_WIDTH = 200;  // Fixed width for consistency
const CARD_MARGIN = 16;  // Margin between cards
const CARD_HEIGHT = 180; // Card height - fixed value for all cards

const RecentRestaurants = () => {
    const dispatch = useDispatch();
    const { recentRestaurantIDs, recentRestaurantsLoading, restaurantsProximity } = useSelector(
        (state) => state.restaurant
    );
    const sliderRef = useRef(null);
    // Track the current slide for animation effects
    const [currentSlide, setCurrentSlide] = useState(0);

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
        // Add smooth scrolling behavior
        swipeToSlide: true,
        cssEase: "cubic-bezier(0.23, 1, 0.32, 1)",
        afterChange: (index) => setCurrentSlide(index),
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
                                    <span>Recent</span>
                                </div>
                                <h5 style={styles.recentName}>{item.restaurantName}</h5>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        );
    };

    return (
        <div className="recent-restaurants">
            <div style={styles.headerContainer}>
                <div style={styles.headerLeft}>
                    <i className="bi bi-clock-history" style={styles.headerIcon}></i>
                    <h3 style={styles.headerTitle}>Recent Orders</h3>
                </div>
            </div>
            <div className="slider-container">
                <Slider ref={sliderRef} {...settings}>
                    {recentRestaurants.map(restaurant => renderRecentItem(restaurant))}
                </Slider>
            </div>

            <style jsx>{`
                .recent-restaurants {
                    background-color: #FFFFFF;
                    padding-bottom: 16px;
                    margin-bottom: 20px;
                }
                .slider-container {
                    padding: 10px 0;
                }
                .recent-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    height: ${CARD_HEIGHT}px !important;
                }
                .recent-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                }
                .slick-track {
                    display: flex;
                }
                .slick-slide {
                    height: inherit;
                    display: flex !important;
                }
                .slick-slide > div {
                    width: 100%;
                    display: flex;
                    height: ${CARD_HEIGHT}px !important;
                }
            `}</style>
        </div>
    );
};

const styles = {
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#E5E7EB',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    headerIcon: {
        fontSize: '20px',
        color: '#50703C',
    },
    headerTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        margin: 0,
    },
    recentCardContainer: {
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        padding: '0',
    },
    recentCard: {
        borderRadius: '12px',
        overflow: 'hidden',
        height: `${CARD_HEIGHT}px`, // Fixed height
        width: '100%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
        backgroundColor: '#f3f4f6',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: '40%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
    },
    recentContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px',
    },
    recentName: {
        color: 'white',
        marginBottom: '0',
        fontSize: '14px',
        fontWeight: '600',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    },
    dateBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        marginBottom: '4px',
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

