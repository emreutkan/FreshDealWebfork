import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {getFlashDealsThunk} from "@src/redux/thunks/restaurantThunks.js";

const FlashDealsModal = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const { flashDealsRestaurants, flashDealsLoading } = useSelector((state) => state.restaurant);

    useEffect(() => {
        if (show) {
            dispatch(getFlashDealsThunk());
        }
    }, [show, dispatch]);

    const availableRestaurants = flashDealsRestaurants?.filter(r => r.flash_deals_available) || [];
    const hasAvailableDeals = availableRestaurants.length > 0;

    const styles = {
        modal: {
            borderRadius: '15px',
            border: 'none',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        },
        modalHeader: {
            borderBottom: '1px solid #f0f0f0',
            padding: '1rem 1.5rem',
        },
        icon: {
            fontSize: '24px',
            color: '#FF5252',
            marginRight: '10px',
        },
        modalBody: {
            padding: '1.5rem',
        },
        discountBox: {
            backgroundColor: '#FFF9F9',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            border: '1px solid #FFEEEE',
        },
        discountTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#FF5252',
            marginBottom: '10px',
        },
        discountItem: {
            fontSize: '16px',
            color: '#555',
            marginBottom: '6px',
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginTop: '20px',
            marginBottom: '15px',
        },
        loadingContainer: {
            textAlign: 'center',
            padding: '20px 0',
        },
        loadingText: {
            marginTop: '10px',
            color: '#50703C',
        },
        restaurantGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px',
        },
        restaurantCard: {
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.2s',
        },
        card: {
            borderRadius: '12px',
            overflow: 'hidden',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
        cardImg: {
            height: '150px',
            objectFit: 'cover',
            width: '100%',
        },
        cardBody: {
            padding: '15px',
        },
        cardTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '10px',
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
        },
        distance: {
            fontSize: '14px',
            color: '#666',
        },
        rating: {
            fontSize: '14px',
            color: '#666',
        },
        flashDealBadge: {
            backgroundColor: '#FF5252',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            padding: '4px 8px',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            marginTop: '10px',
        },
        badgeIcon: {
            marginRight: '5px',
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
        >
            <Modal.Header closeButton style={styles.modalHeader}>
                <Modal.Title className="d-flex align-items-center">
                    <i className="bi bi-lightning-fill" style={styles.icon}></i>
                    Flash Deals
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={styles.modalBody}>
                <div style={styles.discountBox}>
                    <h5 style={styles.discountTitle}>Available Discounts:</h5>
                    <p style={styles.discountItem}>• Spend 150+ TL: Get 50 TL off</p>
                    <p style={styles.discountItem}>• Spend 200+ TL: Get 75 TL off</p>
                    <p style={styles.discountItem}>• Spend 250+ TL: Get 100 TL off</p>
                    <p style={styles.discountItem}>• Spend 400+ TL: Get 150 TL off</p>
                </div>

                <div>
                    <h5 style={styles.sectionTitle}>
                        {hasAvailableDeals
                            ? 'Restaurants with Flash Deals Near You'
                            : 'No restaurants with Flash Deals available nearby'}
                    </h5>

                    {flashDealsLoading ? (
                        <div style={styles.loadingContainer}>
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading Flash Deals...</span>
                            </div>
                            <p style={styles.loadingText}>Loading Flash Deals...</p>
                        </div>
                    ) : hasAvailableDeals ? (
                        <div style={styles.restaurantGrid}>
                            {availableRestaurants.map(restaurant => (
                                <Link
                                    to={`/restaurant/${restaurant.id}`}
                                    style={styles.restaurantCard}
                                    key={restaurant.id}
                                >
                                    <div style={styles.card}>
                                        <img
                                            src={restaurant.image_url || 'https://via.placeholder.com/300x200?text=Restaurant'}
                                            alt={restaurant.restaurantName}
                                            style={styles.cardImg}
                                        />
                                        <div style={styles.cardBody}>
                                            <h5 style={styles.cardTitle}>{restaurant.restaurantName}</h5>
                                            <div style={styles.infoRow}>
                                                <div style={styles.distance}>
                                                    <i className="bi bi-geo-alt me-1"></i>
                                                    {restaurant.distance_km ? `${restaurant.distance_km.toFixed(1)} km` : 'Distance N/A'}
                                                </div>
                                                <div style={styles.rating}>
                                                    <i className="bi bi-star-fill text-warning me-1"></i>
                                                    {restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}
                                                </div>
                                            </div>
                                            <div style={styles.flashDealBadge}>
                                                <i className="bi bi-lightning-fill" style={styles.badgeIcon}></i>
                                                Flash Deal Available
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : null}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FlashDealsModal;