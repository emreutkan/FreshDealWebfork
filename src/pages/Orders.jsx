import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchActiveOrdersAsync, fetchPreviousOrdersAsync } from '@src/redux/thunks/purchaseThunks.js';

const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // If status was passed from another component through location state, use it
    // Otherwise default to 'active'
    const initialStatus = location.state?.status || 'active';
    const [activeTab, setActiveTab] = useState(initialStatus);

    const {
        activeOrders,
        previousOrders,
        loadingActiveOrders,
        loadingPreviousOrders,
        previousOrdersPagination
    } = useSelector((state) => state.purchase);

    useEffect(() => {
        loadOrders();
    }, [activeTab]);

    const loadOrders = async () => {
        if (activeTab === 'active') {
            await dispatch(fetchActiveOrdersAsync());
        } else {
            setCurrentPage(1);
            await dispatch(fetchPreviousOrdersAsync({page: 1}));
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    };

    const loadMorePreviousOrders = async () => {
        if (activeTab === 'previous' &&
            previousOrdersPagination.hasNext &&
            !loadingPreviousOrders) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            await dispatch(fetchPreviousOrdersAsync({page: nextPage}));
        }
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
    };

    const handleScroll = useCallback((e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
            loadMorePreviousOrders();
        }
    }, [loadMorePreviousOrders]);

    // Function to get status badge color and icon
    const getStatusInfo = (status) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return {
                    bg: '#FFF3CD',
                    text: '#856404',
                    icon: 'bi-clock',
                    label: 'Pending'
                };
            case 'ACCEPTED':
                return {
                    bg: '#D4EDDA',
                    text: '#155724',
                    icon: 'bi-check-circle',
                    label: 'Accepted'
                };
            case 'COMPLETED':
                return {
                    bg: '#50703C',
                    text: '#FFFFFF',
                    icon: 'bi-check2-circle',
                    label: 'Completed'
                };
            case 'REJECTED':
                return {
                    bg: '#F8D7DA',
                    text: '#721C24',
                    icon: 'bi-x-circle',
                    label: 'Rejected'
                };
            default:
                return {
                    bg: '#E2E3E5',
                    text: '#383D41',
                    icon: 'bi-question-circle',
                    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
                };
        }
    };

    // Order card component
    const OrderCard = ({ order, index }) => {
        const formattedDate = new Date(order.purchase_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

        const formattedPrice = `${order.total_price}₺`; // This line is already correct, no $ sign
        const statusInfo = getStatusInfo(order.status);

        return (
            <div
                className="order-card"
                onClick={() => navigate(`/order/${order.purchase_id}`)}
                style={{
                    animationDelay: `${index * 100}ms`
                }}
            >
                <div className="order-top-section">
                    <div className="order-header">
                        <h3 className="order-title">{order.listing_title}</h3>
                        <div className="status-badge" style={{ backgroundColor: statusInfo.bg }}>
                            <i className={`${statusInfo.icon} me-1`} style={{ color: statusInfo.text }}></i>
                            <span style={{ color: statusInfo.text }}>{statusInfo.label}</span>
                        </div>
                    </div>

                    <div className="order-info">
                        <div className="order-info-item">
                            <i className="bi bi-shop me-2"></i>
                            <span>{order.restaurant_name || 'Restaurant'}</span>
                        </div>

                        <div className="order-info-item">
                            <i className="bi bi-cart me-2"></i>
                            <span>Quantity: {order.quantity}</span>
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="order-footer">
                    <div className="date-container">
                        <i className="bi bi-calendar3 me-2"></i>
                        <span>{formattedDate}</span>
                    </div>

                    <div className="price-container">
                        <span className="order-price">{formattedPrice}</span>
                        <i className="bi bi-chevron-right ms-2"></i>
                    </div>
                </div>
            </div>
        );
    };

    // Empty state component
    const EmptyState = () => (
        <div className="empty-container">
            <div className="empty-icon">
                <i className="bi bi-receipt"></i>
            </div>
            <h3 className="empty-title">
                {activeTab === 'active' ? 'No Active Orders' : 'No Previous Orders'}
            </h3>
            <p className="empty-text">
                {activeTab === 'active'
                    ? "You don't have any active orders at the moment"
                    : "You haven't completed any orders yet"}
            </p>
            <button
                className="empty-button"
                onClick={() => navigate('/')}
            >
                Browse Restaurants
            </button>
        </div>
    );

    return (
        <div className="orders-container">
            <div className="orders-header">
                <div className="header-top-row">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <h1 className="header-title">My Orders</h1>
                    <div className="header-right"></div>
                </div>

                <div className="tab-container">
                    <button
                        className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => switchTab('active')}
                    >
                        Active
                        {activeTab === 'active' && <div className="tab-indicator"></div>}
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'previous' ? 'active' : ''}`}
                        onClick={() => switchTab('previous')}
                    >
                        Previous
                        {activeTab === 'previous' && <div className="tab-indicator"></div>}
                    </button>
                </div>
            </div>

            {(loadingActiveOrders && activeTab === 'active') ||
            (loadingPreviousOrders && activeTab === 'previous' && previousOrders.length === 0) ? (
                <div className="loading-container">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="loading-text">Loading orders...</p>
                </div>
            ) : (
                <div
                    className="orders-list-container"
                    onScroll={handleScroll}
                >
                    <div className={`orders-list ${(activeTab === 'active' && activeOrders.length === 0) ||
                    (activeTab === 'previous' && previousOrders.length === 0) ? 'empty-list' : ''}`}
                    >
                        {activeTab === 'active' && activeOrders.length > 0 &&
                            activeOrders.map((order, index) => (
                                <OrderCard key={order.purchase_id} order={order} index={index} />
                            ))
                        }

                        {activeTab === 'previous' && previousOrders.length > 0 &&
                            previousOrders.map((order, index) => (
                                <OrderCard key={order.purchase_id} order={order} index={index} />
                            ))
                        }

                        {((activeTab === 'active' && activeOrders.length === 0) ||
                                (activeTab === 'previous' && previousOrders.length === 0)) &&
                            <EmptyState />
                        }

                        {activeTab === 'previous' && loadingPreviousOrders && previousOrders.length > 0 && (
                            <div className="footer-loader">
                                <div className="spinner-border spinner-border-sm text-success" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .orders-container {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 300px;
                }
                
                .loading-text {
                    margin-top: 12px;
                    color: #666;
                    font-size: 16px;
                }
                
                .orders-header {
                    background-color: #FFFFFF;
                    padding-bottom: 10px;
                    border-bottom-left-radius: 20px;
                    border-bottom-right-radius: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                
                .header-top-row {
                    display: flex;
                    align-items: center;
                    padding: 16px 20px;
                }
                
                .back-button {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #333;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    transition: background-color 0.2s;
                }
                
                .back-button:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                }
                
                .header-title {
                    flex: 1;
                    text-align: center;
                    font-size: 22px;
                    color: #333;
                    margin: 0;
                    font-weight: 600;
                }
                
                .header-right {
                    width: 40px;
                }
                
                .tab-container {
                    display: flex;
                    padding: 0 20px;
                    margin-top: 5px;
                }
                
                .tab-button {
                    flex: 1;
                    padding: 10px;
                    background: none;
                    border: none;
                    font-size: 15px;
                    color: #999;
                    position: relative;
                    cursor: pointer;
                    transition: color 0.3s;
                }
                
                .tab-button.active {
                    color: #50703C;
                    font-weight: 600;
                }
                
                .tab-indicator {
                    position: absolute;
                    bottom: 0;
                    left: calc(50% - 20px);
                    height: 3px;
                    width: 40px;
                    background-color: #50703C;
                    border-radius: 2px;
                }
                
                .orders-list-container {
                    padding: 16px;
                    max-height: calc(100vh - 120px);
                    overflow-y: auto;
                }
                
                .orders-list {
                    padding-top: 8px;
                }
                
                .empty-list {
                    display: flex;
                    justify-content: center;
                    min-height: 400px;
                }
                
                .order-card {
                    background-color: #FFFFFF;
                    border-radius: 16px;
                    margin-bottom: 16px;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                    cursor: pointer;
                    animation: fadeInUp 0.5s ease forwards;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .order-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
                }
                
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .order-top-section {
                    padding: 16px;
                }
                
                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                
                .order-title {
                    font-size: 16px;
                    color: #333;
                    margin: 0;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 70%;
                }
                
                .status-badge {
                    display: flex;
                    align-items: center;
                    padding: 6px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 500;
                    margin-left: 8px;
                }
                
                .order-info {
                    margin-top: 5px;
                }
                
                .order-info-item {
                    display: flex;
                    align-items: center;
                    margin: 3px 0;
                    font-size: 13px;
                    color: #666;
                }
                
                .divider {
                    height: 1px;
                    width: 100%;
                    background: linear-gradient(to right, #f8f8f8, #ffffff);
                }
                
                .order-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                }
                
                .date-container {
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    color: #666;
                }
                
                .price-container {
                    display: flex;
                    align-items: center;
                }
                
                .order-price {
                    color: #50703C;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .empty-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 40px 20px;
                    align-self: center;
                }
                
                .empty-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 40px;
                    background-color: #f0f0f0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .empty-icon i {
                    font-size: 40px;
                    color: #999;
                }
                
                .empty-title {
                    font-size: 20px;
                    color: #333;
                    margin-bottom: 8px;
                    font-weight: 600;
                }
                
                .empty-text {
                    font-size: 14px;
                    color: #666;
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .empty-button {
                    background-color: #50703C;
                    color: #FFF;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    transition: background-color 0.2s;
                }
                
                .empty-button:hover {
                    background-color: #455f31;
                }
                
                .footer-loader {
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                @media (max-width: 768px) {
                    .header-title {
                        font-size: 20px;
                    }
                    
                    .orders-list-container {
                        padding: 12px;
                    }
                }
                
                @media (min-width: 992px) {
                    .orders-list {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default Orders;

