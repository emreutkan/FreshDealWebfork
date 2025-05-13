import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavoritesThunk } from "../redux/thunks/userThunks";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FavoriteRestaurantList = () => {
    const dispatch = useDispatch();
    const { favoriteRestaurantsIDs, restaurantsProximity } = useSelector((state) => state.restaurant);
    const sliderRef = useRef(null);

    const favoriteRestaurants = restaurantsProximity.filter(restaurant =>
        favoriteRestaurantsIDs.includes(restaurant.id)
    );

    const debugFavorites = async () => {
        try {
            const response = await dispatch(getFavoritesThunk()).unwrap();
            alert(`Favorites Response:\n${JSON.stringify(response, null, 2)}`);
        } catch (error) {
            alert(`Debug Error:\n${JSON.stringify(error, null, 2)}`);
        }
    };

    const debugState = () => {
        alert(`Current State:\nFavorites: ${JSON.stringify(favoriteRestaurantsIDs)}\nRestaurants: ${JSON.stringify(favoriteRestaurants.map(r => r.restaurantName))}`);
    };

    const isRestaurantOpen = (workingDays, workingHoursStart, workingHoursEnd) => {
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', {weekday: 'long'});
        if (!workingDays.includes(currentDay)) return false;
        if (workingHoursStart && workingHoursEnd) {
            const [startHour, startMinute] = workingHoursStart.split(':').map(Number);
            const [endHour, endMinute] = workingHoursEnd.split(':').map(Number);
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTime = currentHour * 60 + currentMinute;
            const startTime = startHour * 60 + startMinute;
            const endTime = endHour * 60 + endMinute;
            return currentTime >= startTime && currentTime <= endTime;
        }
        return true;
    };

    const isRestaurantAvailable = (restaurant) => {
        return isRestaurantOpen(restaurant.workingDays, restaurant.workingHoursStart, restaurant.workingHoursEnd)
            && restaurant.listings > 0;
    };

    if (favoriteRestaurants.length === 0) {
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

    const renderFavoriteItem = (item) => {
        const isAvailable = isRestaurantAvailable(item);

        return (
            <div key={`favorite-${item.id}`} style={styles.favoriteCardContainer}>
                <Link
                    to={isAvailable ? `/restaurant/${item.id}` : "#"}
                    className="text-decoration-none"
                    style={!isAvailable ? {pointerEvents: 'none'} : {}}
                >
                    <div style={{...styles.favoriteCard, ...((!isAvailable) ? styles.unavailableCard : {})}}>
                        <div style={styles.favoriteImageContainer}>
                            {item.image_url ? (
                                <div style={{position: 'relative', height: '100%'}}>
                                    <img
                                        src={item.image_url}
                                        alt={item.restaurantName}
                                        style={styles.favoriteImage}
                                    />
                                    <div style={styles.gradientOverlay}></div>
                                </div>
                            ) : (
                                <div style={styles.favoriteNoImage}>
                                    <i className="bi bi-cup-hot fs-4 text-secondary"></i>
                                </div>
                            )}

                            {!isAvailable && (
                                <div style={styles.unavailableOverlay}>
                                    <i className="bi bi-clock me-1"></i>
                                    <span>
                                        {!isRestaurantOpen(item.workingDays, item.workingHoursStart, item.workingHoursEnd)
                                            ? 'Closed'
                                            : 'No Stock'}
                                    </span>
                                </div>
                            )}

                            <div style={styles.favoriteContent}>
                                <div style={styles.ratingBadge}>
                                    <i className="bi bi-star-fill me-1 text-warning"></i>
                                    <span>{(item.rating ?? 0).toFixed(1)}</span>
                                </div>
                                <h5 style={styles.favoriteTitle}>{item.restaurantName}</h5>
                            </div>
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
                    <i className="bi bi-heart-fill me-2 text-success"></i>
                    <h4 className="mb-0 fw-bold">Favorites</h4>
                </div>
                <div style={styles.headerRight}>
                    <button onClick={debugState} className="btn btn-sm btn-light me-2">
                        State
                    </button>
                    <button onClick={debugFavorites} className="btn btn-sm btn-light me-2">
                        API
                    </button>
                    <Link to="/favorites">
                        <i className="bi bi-chevron-right text-success fs-5"></i>
                    </Link>
                </div>
            </div>

            <div style={styles.sliderContainer}>
                <Slider ref={sliderRef} {...settings}>
                    {favoriteRestaurants.map(restaurant => renderFavoriteItem(restaurant))}
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
    favoriteCardContainer: {
        padding: '0 8px'
    },
    favoriteCard: {
        height: '130px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        marginBottom: '15px'
    },
    favoriteImageContainer: {
        height: '100%',
        position: 'relative'
    },
    favoriteImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    favoriteNoImage: {
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
    favoriteContent: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: '8px'
    },
    ratingBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '2px 6px',
        borderRadius: '6px',
        marginBottom: '4px',
        color: '#fff',
        fontSize: '12px',
        fontWeight: '600'
    },
    favoriteTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#fff',
        margin: 0,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    },
    unavailableCard: {
        opacity: 0.9,
    },
    unavailableOverlay: {
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
        fontWeight: '600',
        flexDirection: 'row',
        gap: '4px'
    }
};

export default FavoriteRestaurantList;