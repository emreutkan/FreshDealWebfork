import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentRestaurantsThunk } from "@src/redux/thunks/restaurantThunks";
import { isRestaurantOpen } from "../utils/RestaurantFilters.js";
import { Link } from "react-router-dom";
import { useRestaurantFilter } from "@src/context/RestaurantFilterContext"; // Import the context hook

// Define consistent card sizing (similar to mobile)
const CARD_WIDTH = 200;
const CARD_MARGIN = 16;
const CARD_HEIGHT = 140;

const RecentRestaurants = () => {
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const { showClosedRestaurants } = useRestaurantFilter(); // Use the global state

    const { recentRestaurantIDs, recentRestaurantsLoading, restaurantsProximity } = useSelector(
        (state) => state.restaurant
    );

    useEffect(() => {
        dispatch(getRecentRestaurantsThunk());
    }, [dispatch]); // Added missing useEffect to fetch recent restaurants

    const recentRestaurantsFromProximity = restaurantsProximity.filter(restaurant =>
        recentRestaurantIDs.includes(restaurant.id)
    );

    // Filter based on the global showClosedRestaurants state
    const filteredRecentRestaurants = showClosedRestaurants
        ? recentRestaurantsFromProximity
        : recentRestaurantsFromProximity.filter(restaurant =>
            isRestaurantOpen(restaurant.workingDays, restaurant.workingHoursStart, restaurant.workingHoursEnd) && restaurant.listings > 0
          );

    // Styles
    const styles = {
        container: {
            backgroundColor: '#FFFFFF',
            paddingBottom: '16px',
            marginBottom: '16px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            borderRadius: '8px',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #E5E7EB',
        },
        headerLeft: {
            display: 'flex',
            alignItems: 'center',
        },
        headerIcon: {
            color: '#50703C',
            fontSize: '20px',
            marginRight: '10px',
        },
        headerTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: '0',
        },
        carousel: {
            display: 'flex',
            overflowX: 'auto',
            padding: '16px',
            scrollBehavior: 'smooth',
        },
        card: {
            width: `${CARD_WIDTH}px`,
            height: `${CARD_HEIGHT}px`,
            flexShrink: 0,
            marginRight: `${CARD_MARGIN}px`,
        },
        cardLink: {
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            height: '100%',
        },
        cardImage: {
            position: 'relative',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        noImage: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            color: '#999',
        },
        gradient: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '60%',
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))',
        },
        contentContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '8px',
            zIndex: 1,
        },
        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(80,112,60,0.8)',
            paddingLeft: '6px',
            paddingRight: '6px',
            paddingTop: '2px',
            paddingBottom: '2px',
            borderRadius: '6px',
            marginBottom: '4px',
        },
        badgeIcon: {
            color: '#fff',
            fontSize: '14px',
            marginRight: '4px',
        },
        badgeText: {
            color: '#fff',
            fontSize: '12px',
            fontWeight: '600',
        },
        title: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#fff',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.75)',
            margin: '0',
        },
        loadingContainer: {
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        loadingText: {
            color: '#50703C',
            marginTop: '8px',
            fontSize: '14px',
        },
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontWeight: '600',
            zIndex: 2,
            borderRadius: '12px',
        },
        emptyStateContainer: {
            padding: '20px',
            textAlign: 'center',
            color: '#6B7280',
        },
    };

    // Don't show anything if we're still loading or if the filtered list is empty (when not showing closed)
    if (recentRestaurantsLoading) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <i className="bi bi-clock-history" style={styles.headerIcon}></i>
                        <h3 style={styles.headerTitle}>Recent Orders</h3>
                    </div>
                </div>
                <div style={styles.loadingContainer}>
                    <div className="spinner-border spinner-border-sm text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={styles.loadingText}>Loading your recent orders...</p>
                </div>
            </div>
        );
    }

    if (!filteredRecentRestaurants || filteredRecentRestaurants.length === 0) {
        // If not loading but list is empty
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <i className="bi bi-clock-history" style={styles.headerIcon}></i>
                        <h3 style={styles.headerTitle}>Recent Orders</h3>
                    </div>
                </div>
                <div style={styles.emptyStateContainer}>
                    <p>No recent orders to show. {showClosedRestaurants ? "" : "Try enabling \"Show closed restaurants\"."}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <i className="bi bi-clock-history" style={styles.headerIcon}></i>
                    <h3 style={styles.headerTitle}>Recent Orders</h3>
                </div>
            </div>

            <div style={styles.carousel} ref={scrollRef}>
                {filteredRecentRestaurants.map((restaurant) => { // Use filtered list
                    const isOpen = isRestaurantOpen(restaurant.workingDays, restaurant.workingHoursStart, restaurant.workingHoursEnd);
                    const hasStock = restaurant.listings > 0;

                    const isDisabled = !isOpen || !hasStock;
                    const overlayMessage = !isOpen
                        ? 'Currently Closed'
                        : !hasStock
                            ? 'Out of Stock'
                            : '';

                    return (
                        <div style={styles.card} key={`recent-${restaurant.id}`}>
                            <Link
                                to={!isDisabled ? `/restaurant/${restaurant.id}` : '#'}
                                style={{
                                    ...styles.cardLink,
                                    pointerEvents: isDisabled ? 'none' : 'auto',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                <div style={styles.cardImage}>
                                    {restaurant.image_url ? (
                                        <img src={restaurant.image_url} alt={restaurant.restaurantName} style={styles.image} />
                                    ) : (
                                        <div style={styles.noImage}>
                                            <i className="bi bi-card-image"></i>
                                        </div>
                                    )}

                                    <div style={styles.gradient}></div>

                                    {isDisabled && (
                                        <div style={styles.overlay}>{overlayMessage}</div>
                                    )}

                                    <div style={styles.contentContainer}>
                                        <div style={styles.badge}>
                                            <i className="bi bi-clock-history" style={styles.badgeIcon}></i>
                                            <span style={styles.badgeText}>Recent</span>
                                        </div>
                                        <h5 style={styles.title}>{restaurant.restaurantName}</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentRestaurants;

