import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetailsAsync } from '@src/redux/thunks/purchaseThunks';
import { addRestaurantCommentThunk } from '@src/redux/thunks/restaurantThunks';
import axios from 'axios';
import { API_BASE_URL } from '@src/redux/api/API';

const POSITIVE_BADGES = [
    {
        id: 'fresh',
        name: 'Fresh',
        icon: 'bi-apple',
        description: 'Food was fresh and high quality'
    },
    {
        id: 'fast_delivery',
        name: 'Fast Delivery',
        icon: 'bi-truck',
        description: 'Delivery was quick and on time'
    },
    {
        id: 'customer_friendly',
        name: 'Customer Friendly',
        icon: 'bi-emoji-smile',
        description: 'Great customer service'
    }
];

const NEGATIVE_BADGES = [
    {
        id: 'not_fresh',
        name: 'Not Fresh',
        icon: 'bi-x-circle',
        description: 'Food quality was below expectations'
    },
    {
        id: 'slow_delivery',
        name: 'Slow Delivery',
        icon: 'bi-hourglass',
        description: 'Delivery took longer than expected'
    },
    {
        id: 'not_customer_friendly',
        name: 'Poor Service',
        icon: 'bi-emoji-frown',
        description: 'Customer service was unsatisfactory'
    }
];

const OrderDetails = () => {
    const params = useParams();
    const orderId = params.id;
    console.log(useParams());
    console.log("Order ID:", orderId);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentOrder, loadingCurrentOrder } = useSelector(
        (state) => state.purchase
    );
    const token = useSelector((state) => state.user.token);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedBadges, setSelectedBadges] = useState([]);
    const [reportImage, setReportImage] = useState(null);
    const [reportComment, setReportComment] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showReportModal, setShowReportModal] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!orderId) {
                    console.error("Order ID is missing from URL parameters");
                    return;
                }
                await dispatch(fetchOrderDetailsAsync(orderId));
            } catch (err) {
                console.error("Error fetching order details:", err);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [dispatch, orderId]);

    useEffect(() => {
        if (rating > 0) {
            setSelectedBadges([]);
        }
    }, [rating]);



    const handleBadgeToggle = (badgeId) => {
        setSelectedBadges(prevBadges => {
            if (prevBadges.includes(badgeId)) {
                return prevBadges.filter(id => id !== badgeId);
            } else {
                return [...prevBadges, badgeId];
            }
        });
    };

    const handleSubmitRating = () => {
        if (currentOrder?.restaurant?.id && rating > 0) {
            dispatch(addRestaurantCommentThunk({
                restaurantId: currentOrder.restaurant.id,
                commentData: {
                    comment: comment.trim() || ' ',
                    rating: rating,
                    purchase_id: currentOrder.purchase_id,
                    badge_names: selectedBadges.length > 0 ? selectedBadges : undefined
                }
            }))
                .unwrap()
                .then(() => {
                    alert('Thank you for your rating!');
                    setRating(0);
                    setComment('');
                    setSelectedBadges([]);
                })
                .catch((error) => {
                    alert(error.data?.message || "You have already rated this restaurant");
                    console.error('Rating submission error:', error);
                });
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                setReportImage({
                    file: file,
                    preview: event.target.result
                });
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmitReport = async () => {
        if (!currentOrder || !reportComment.trim() || !reportImage) {
            alert('Please provide both an image and description of the issue');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('purchase_id', currentOrder.purchase_id.toString());
            formData.append('description', reportComment.trim());
            formData.append('image', reportImage.file);

            console.log('Submitting report with:', {
                purchase_id: currentOrder.purchase_id,
                description: reportComment.trim(),
            });

            // Configure request with upload progress
            const response = await axios.post(`${API_BASE_URL}/report`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            console.log('Response:', response.data);

            alert('Your report has been submitted successfully');
            setShowReportModal(false);
            setReportImage(null);
            setReportComment('');
            setUploadProgress(0);

        } catch (error) {
            console.error('Report submission error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to submit report'
            );
            setUploadProgress(0);
        }
    };

    const getStatusColor = () => {
        switch (currentOrder?.status) {
            case 'PENDING':
                return '#FFC107';
            case 'ACCEPTED':
                return '#4CAF50';
            case 'COMPLETED':
                return '#50703C';
            case 'REJECTED':
                return '#F44336';
            default:
                return '#9E9E9E';
        }
    };

    const getStatusIcon = () => {
        switch (currentOrder?.status) {
            case 'PENDING':
                return 'bi-clock';
            case 'ACCEPTED':
                return 'bi-check-circle';
            case 'COMPLETED':
                return 'bi-check2-circle';
            case 'REJECTED':
                return 'bi-x-circle';
            default:
                return 'bi-question-circle';
        }
    };

    const renderOrderStatus = () => {
        if (!currentOrder) return null;

        if (!currentOrder.hasOwnProperty('completion_image_url') || !currentOrder.completion_image_url) {
            if (currentOrder.status !== 'COMPLETED') {
                return (
                    <div className="status-container">
                        <div className="status-icon-container">
                            <i className="bi bi-hourglass"></i>
                        </div>
                        <p className="status-text">
                            Waiting for restaurant to prepare and upload the food image
                        </p>
                    </div>
                );
            } else {
                return (
                    <div className="status-container error">
                        <div className="status-icon-container">
                            <i className="bi bi-exclamation-circle"></i>
                        </div>
                        <p className="status-text error-text">
                            Backend Error: Completion image missing
                        </p>
                    </div>
                );
            }
        }

        return (
            <div className="image-container">
                <img
                    src={currentOrder.completion_image_url}
                    alt="Order completion"
                    className="completion-image"
                />
                <div className="image-gradient"></div>
                <div className="status-badge-completed">
                    <span>{currentOrder.status}</span>
                </div>
            </div>
        );
    };

    const RatingStars = () => {
        return (
            <div className="rating-container">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className="star-button"
                        onClick={() => setRating(star)}
                    >
                        <i
                            className={rating >= star ? "bi bi-star-fill" : "bi bi-star"}
                            style={{color: rating >= star ? "#FFD700" : "#CCCCCC"}}
                        ></i>
                    </button>
                ))}
            </div>
        );
    };

    const BadgeSelector = () => {
        const currentBadges = rating >= 3 ? POSITIVE_BADGES : NEGATIVE_BADGES;

        return (
            <div className="badge-selector-container">
                <h3 className="badge-selector-title">
                    {rating >= 3
                        ? "What did you like about your order?"
                        : "What issues did you experience?"}
                </h3>
                <div className="badges-grid">
                    {currentBadges.map((badge) => (
                        <div
                            key={badge.id}
                            className={`badge-item ${selectedBadges.includes(badge.id) ?
                                (rating >= 3 ? 'positive-selected' : 'negative-selected') : ''}`}
                            onClick={() => handleBadgeToggle(badge.id)}
                        >
                            <div className={`badge-icon-container ${rating >= 3 ? 'positive' : 'negative'}`}>
                                <i
                                    className={`bi ${badge.icon}`}
                                    style={{
                                        color: selectedBadges.includes(badge.id) ?
                                            "#FFFFFF" : (rating >= 3 ? "#50703C" : "#D32F2F")
                                    }}
                                ></i>
                            </div>
                            <span className={`badge-name ${!selectedBadges.includes(badge.id) && rating < 3 ? 'negative' : ''} 
                                ${selectedBadges.includes(badge.id) ? 'selected' : ''}`}
                            >
                                {badge.name}
                            </span>
                            <span className={`badge-description ${!selectedBadges.includes(badge.id) && rating < 3 ? 'negative' : ''} 
                                ${selectedBadges.includes(badge.id) ? 'selected' : ''}`}
                            >
                                {badge.description}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderRatingSection = () => {
        if (!currentOrder) {
            return null;
        }
        if (currentOrder.status === 'COMPLETED') {
            return (
                <div className="rating-section">
                    <h3 className="section-title">
                        Share Your Experience
                    </h3>

                    <p className="rating-prompt">How was your order?</p>
                    <RatingStars />

                    {rating > 0 && <BadgeSelector />}

                    <label className="input-label">Additional Comments</label>
                    <textarea
                        className="comment-input"
                        placeholder="Tell us more about your experience (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <button
                        className={`submit-button ${rating < 3 && rating > 0 ? 'negative' : ''}`}
                        onClick={handleSubmitRating}
                        disabled={rating === 0}
                    >
                        Submit Review
                    </button>
                </div>
            );
        }
        return null;
    };

    const ReportModal = () => (
        <div className={`report-modal-overlay ${showReportModal ? 'show' : ''}`}>
            <div className="report-modal">
                <div className="report-header">
                    <h3 className="report-title">Report an Issue</h3>
                    <button className="close-button" onClick={() => setShowReportModal(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div
                    className="image-upload-container"
                    onClick={() => fileInputRef.current.click()}
                >
                    {reportImage ? (
                        <>
                            <img
                                src={reportImage.preview}
                                alt="Report"
                                className="uploaded-image"
                            />
                            <button
                                className="change-image-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current.click();
                                }}
                            >
                                Change Image
                            </button>
                        </>
                    ) : (
                        <>
                            <i className="bi bi-image-fill"></i>
                            <p className="upload-text">Upload Image</p>
                            <p className="upload-subtext">Click to choose a photo</p>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>

                <label className="input-label">Issue Description</label>
                <textarea
                    className="report-comment-input"
                    placeholder="Describe what's wrong with your order..."
                    value={reportComment}
                    onChange={(e) => setReportComment(e.target.value)}
                ></textarea>

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                        <p className="progress-text">{`${Math.round(uploadProgress)}%`}</p>
                    </div>
                )}

                <button
                    className={`report-submit-button ${(!reportImage || !reportComment.trim()) ? 'disabled' : ''}`}
                    onClick={handleSubmitReport}
                    disabled={!reportImage || !reportComment.trim() || uploadProgress > 0}
                >
                    {uploadProgress > 0 ? 'Uploading...' : 'Submit Report'}
                </button>
            </div>
        </div>
    );

    if (!orderId) {
        return (
            <div className="loading-container">
                <p className="text-danger">Error: No order ID found in URL</p>
                <button
                    className="btn btn-primary mt-2"
                    onClick={() => navigate('/orders')}
                >
                    Return to Orders
                </button>
            </div>
        );
    }

    if (loadingCurrentOrder || !currentOrder) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="loading-text">Loading order details...</p>
            </div>
        );
    }

    return (
        <div className="order-details-container">
            <div className={`sticky-header visible`}>
                <div className="container">
                    <div className="header-content">
                        <button className="back-button" onClick={() => navigate(-1)}>
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <h1 className="header-title">{currentOrder.listing_title}</h1>
                        {currentOrder.status === 'COMPLETED' && (
                            <button
                                className="report-button"
                                onClick={() => setShowReportModal(true)}
                            >
                                <i className="bi bi-exclamation-triangle-fill"></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="floating-back-button" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left"></i>
            </div>

            <div className="container">
                <div className="order-details-content">
                    <div className="hero-section">
                        <h1 className="order-title">{currentOrder.listing_title}</h1>

                        <div className="status-badge" style={{ backgroundColor: getStatusColor() }}>
                            <i className={`bi ${getStatusIcon()} me-2`} style={{ color: '#FFFFFF' }}></i>
                            <span>{currentOrder.status}</span>
                        </div>

                        <div className="order-id-row">
                            <span className="order-id">
                                Order #{currentOrder.purchase_id}
                            </span>
                            <span className="order-date">
                                {new Date(currentOrder.purchase_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    {renderOrderStatus()}

                    <div className="card order-info-card">
                        <div className="section-header">
                            <i className="bi bi-info-circle"></i>
                            <h3 className="section-title">Order Information</h3>
                        </div>

                        {currentOrder.restaurant && (
                            <div className="detail-row">
                                <div className="detail-icon-container">
                                    <i className="bi bi-shop"></i>
                                </div>
                                <span className="detail-label">Restaurant</span>
                                <span className="detail-value">
                                    {currentOrder.restaurant.name}
                                </span>
                            </div>
                        )}

                        <div className="detail-row">
                            <div className="detail-icon-container">
                                <i className="bi bi-cart"></i>
                            </div>
                            <span className="detail-label">Quantity</span>
                            <span className="detail-value">{currentOrder.quantity}</span>
                        </div>

                        <div className="detail-row">
                            <div className="detail-icon-container">
                                <i className={`bi ${currentOrder.is_delivery ? "bi-bicycle" : "bi-person-walking"}`}></i>
                            </div>
                            <span className="detail-label">Order Type</span>
                            <span className="detail-value">
                                {currentOrder.is_delivery ? "Delivery" : "Pickup"}
                            </span>
                        </div>

                        <div className="detail-row">
                            <div className="detail-icon-container">
                                <i className="bi bi-cash"></i>
                            </div>
                            <span className="detail-label">Amount</span>
                            <span className="detail-value">
                                {currentOrder.total_price}₺
                            </span>
                        </div>

                        <div className="detail-row">
                            <div className="detail-icon-container">
                                <i className="bi bi-calendar"></i>
                            </div>
                            <span className="detail-label">Date</span>
                            <span className="detail-value">
                                {new Date(currentOrder.purchase_date).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {currentOrder.is_delivery && (
                        <div className="card delivery-card">
                            <div className="section-header">
                                <i className="bi bi-geo-alt"></i>
                                <h3 className="section-title">Delivery Information</h3>
                            </div>
                            <div className="address-container">
                                <p className="address-text">{currentOrder.delivery_address}</p>
                                {currentOrder.delivery_notes && (
                                    <div className="notes-container">
                                        <span className="notes-label">Notes:</span>
                                        <p className="notes-text">{currentOrder.delivery_notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {renderRatingSection()}
                </div>
            </div>

            <ReportModal />

            <style jsx>{`
                .order-details-container {
                    min-height: 100vh;
                    background-color: #F8F9FA;
                    padding-bottom: 40px;
                }

                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 15px;
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 60vh;
                }

                .loading-text {
                    margin-top: 12px;
                    color: #666;
                    font-size: 16px;
                }

                .sticky-header {
                    position: fixed;
                    top: -70px;
                    left: 0;
                    right: 0;
                    background-color: white;
                    z-index: 1000;
                    padding: 15px 0;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: top 0.3s;
                }
                

                .header-content {
                    display: flex;
                    align-items: center;
                }

                .back-button {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #333;
                    cursor: pointer;
                }

                .header-title {
                    flex: 1;
                    text-align: center;
                    font-size: 18px;
                    color: #333;
                    margin: 0;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .report-button {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    background-color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #FF6B6B;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                }

                .floating-back-button {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    background-color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    cursor: pointer;
                    z-index: 900;
                    transition: opacity 0.3s;
                }
                

                .order-details-content {
                    padding-top: 20px;
                }

                .hero-section {
                    padding: 20px 0;
                }

                .order-title {
                    font-size: 24px;
                    color: #333;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 16px;
                    border-radius: 20px;
                    color: white;
                    font-size: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .order-id-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .order-id {
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                }

                .order-date {
                    font-size: 14px;
                    color: #666;
                }

                .status-container {
                    display: flex;
                    align-items: center;
                    background-color: #FFF8E1;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 20px;
                }

                .status-container.error {
                    background-color: #FFEBEE;
                }

                .status-icon-container {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    background-color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 12px;
                    color: #FFA500;
                    font-size: 20px;
                }

                .status-container.error .status-icon-container {
                    color: #FF0000;
                }

                .status-text {
                    flex: 1;
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                }

                .error-text {
                    color: #FF0000;
                }

                .image-container {
                    width: 100%;
                    height: 300px;
                    margin-bottom: 20px;
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .completion-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .image-gradient {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 100px;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent);
                }

                .status-badge-completed {
                    position: absolute;
                    bottom: 16px;
                    right: 16px;
                    background-color: #50703C;
                    padding: 6px 16px;
                    border-radius: 20px;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .card {
                    background-color: white;
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .section-header i {
                    font-size: 20px;
                    color: #50703C;
                }

                .section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin: 0 0 0 8px;
                }

                .detail-row {
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #F0F0F0;
                }

                .detail-row:last-child {
                    border-bottom: none;
                }

                .detail-icon-container {
                    width: 32px;
                    height: 32px;
                    border-radius: 16px;
                    background-color: rgba(80, 112, 60, 0.1);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 12px;
                    color: #50703C;
                }

                .detail-label {
                    flex: 1;
                    font-size: 14px;
                    color: #666;
                }

                .detail-value {
                    font-size: 14px;
                    color: #333;
                    font-weight: 500;
                    text-align: right;
                }

                .address-container {
                    background-color: #F8F8F8;
                    border-radius: 12px;
                    padding: 16px;
                }

                .address-text {
                    font-size: 14px;
                    color: #333;
                    margin-bottom: 8px;
                }

                .notes-container {
                    background-color: white;
                    border-radius: 8px;
                    padding: 12px;
                    margin-top: 8px;
                    border-left: 4px solid #50703C;
                }

                .notes-label {
                    font-size: 12px;
                    color: #666;
                    font-weight: 500;
                    display: block;
                    margin-bottom: 4px;
                }

                .notes-text {
                    font-size: 14px;
                    color: #333;
                    margin: 0;
                }

                .rating-section {
                    background-color: white;
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .rating-prompt {
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 8px;
                    text-align: center;
                }

                .rating-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .star-button {
                    background: none;
                    border: none;
                    font-size: 32px;
                    margin: 0 4px;
                    cursor: pointer;
                    padding: 0;
                }

                .badge-selector-container {
                    margin-bottom: 24px;
                }

                .badge-selector-title {
                    font-size: 16px;
                    color: #333;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .badges-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }

                @media (max-width: 768px) {
                    .badges-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 480px) {
                    .badges-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .badge-item {
                    background-color: white;
                    border-radius: 12px;
                    padding: 12px;
                    border: 1px solid #E0E0E0;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .badge-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .badge-item.positive-selected {
                    background-color: #50703C;
                    border-color: #50703C;
                }

                .badge-item.negative-selected {
                    background-color: #D32F2F;
                    border-color: #D32F2F;
                }

                .badge-icon-container {
                    width: 50px;
                    height: 50px;
                    border-radius: 25px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 24px;
                }

                .badge-icon-container.positive {
                    background-color: rgba(80, 112, 60, 0.1);
                }

                .badge-icon-container.negative {
                    background-color: rgba(211, 47, 47, 0.1);
                }

                .badge-name {
                    font-size: 14px;
                    color: #333;
                    font-weight: 500;
                    text-align: center;
                    margin-bottom: 4px;
                }

                .badge-name.negative {
                    color: #D32F2F;
                }

                .badge-name.selected {
                    color: white;
                }

                .badge-description {
                    font-size: 10px;
                    color: #999;
                    text-align: center;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .badge-description.negative {
                    color: rgba(211, 47, 47, 0.7);
                }

                .badge-description.selected {
                    color: rgba(255, 255, 255, 0.9);
                }

                .input-label {
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 8px;
                    display: block;
                }

                .comment-input {
                    width: 100%;
                    min-height: 120px;
                    background-color: #F8F8F8;
                    border: 1px solid #E0E0E0;
                    border-radius: 12px;
                    padding: 16px;
                    font-size: 14px;
                    color: #333;
                    margin-bottom: 16px;
                    resize: vertical;
                }

                .submit-button {
                    width: 100%;
                    background-color: #50703C;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 16px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .submit-button:hover {
                    background-color: #455f31;
                }

                .submit-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .submit-button.negative {
                    background-color: #D32F2F;
                }

                .submit-button.negative:hover {
                    background-color: #C62828;
                }

                /* Report Modal Styles */
                .report-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s, visibility 0.3s;
                    padding: 20px;
                }

                .report-modal-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }

                .report-modal {
                    background-color: white;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 24px;
                    transform: translateY(20px);
                    transition: transform 0.3s;
                }

                .report-modal-overlay.show .report-modal {
                    transform: translateY(0);
                }

                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .report-title {
                    font-size: 20px;
                    color: #333;
                    font-weight: 600;
                    margin: 0;
                }

                .close-button {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #666;
                    cursor: pointer;
                }

                .image-upload-container {
                    height: 220px;
                    background-color: #F8F8F8;
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border: 2px dashed #E0E0E0;
                    margin-bottom: 24px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .image-upload-container i {
                    font-size: 50px;
                    color: #CCCCCC;
                }

                .upload-text {
                    font-size: 16px;
                    color: #666;
                    font-weight: 500;
                    margin: 12px 0 4px;
                }

                .upload-subtext {
                    font-size: 14px;
                    color: #999;
                }

                .uploaded-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .change-image-button {
                    position: absolute;
                    bottom: 16px;
                    right: 16px;
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 8px 12px;
                    font-size: 12px;
                    cursor: pointer;
                }

                .report-comment-input {
                    width: 100%;
                    min-height: 150px;
                    background-color: #F8F8F8;
                    border: 1px solid #E0E0E0;
                    border-radius: 16px;
                    padding: 16px;
                    font-size: 14px;
                    color: #333;
                    margin-bottom: 24px;
                    resize: vertical;
                }

                .progress-container {
                    height: 8px;
                    background-color: #F5F5F5;
                    border-radius: 4px;
                    margin-bottom: 24px;
                    position: relative;
                    overflow: hidden;
                }

                .progress-bar {
                    height: 100%;
                    background-color: #50703C;
                    border-radius: 4px;
                }

                .progress-text {
                    position: absolute;
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    color: #333;
                    top: -20px;
                    margin: 0;
                }

                .report-submit-button {
                    width: 100%;
                    background-color: #FF6B6B;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 16px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .report-submit-button:hover {
                    background-color: #FF5252;
                }

                .report-submit-button.disabled {
                    background-color: #CCCCCC;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default OrderDetails;