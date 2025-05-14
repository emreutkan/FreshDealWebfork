import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '@src/redux/thunks/cartThunks.js';
import { getRestaurantsByProximity } from '@src/redux/thunks/restaurantThunks.js';
import { createPurchaseOrderAsync, serializeAddressForDelivery } from '@src/redux/thunks/purchaseThunks.js';
import { differenceInMinutes, format, isAfter, isBefore, setHours, setMinutes } from 'date-fns';

const CheckoutSuccess = ({ onAnimationComplete }) => {
    useEffect(() => {
        // Simulate animation completion after delay
        const timer = setTimeout(() => {
            onAnimationComplete();
        }, 1500);

        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    return (
        <div className="checkout-success-container">
            <div className="checkmark-container">
                <i className="bi bi-check-circle-fill"></i>
            </div>

            <style jsx>{`
                .checkout-success-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #FFFFFF;
                }
                
                .checkmark-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    animation: scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards, 
                               rotate 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards,
                               bounce 0.4s ease-out 0.6s;
                }
                
                .checkmark-container i {
                    font-size: 120px;
                    color: #50703C;
                }
                
                @keyframes scaleIn {
                    0% {
                        transform: scale(0);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                
                @keyframes rotate {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                
                @keyframes bounce {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
};

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [deliveryNotes, setDeliveryNotes] = useState('');
    const [isCardAdded, setIsCardAdded] = useState(false);
    const [flashDealsEnabled, setFlashDealsEnabled] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const restaurant = useSelector((state) => state.restaurant.selectedRestaurant);
    const selectedAddressId = useSelector((state) => state.address.selectedAddressId);
    const selectedAddress = useSelector((state) =>
        state.address.addresses.find(address => address.id === selectedAddressId)
    );
    const cartItems = useSelector((state) => state.cart.cartItems);
    const selectedRestaurantListings = useSelector((state) => state.restaurant.selectedRestaurantListings);
    const isPickup = useSelector((state) => state.restaurant.isPickup);

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(getRestaurantsByProximity());
    }, [dispatch]);

    const currentDate = new Date();
    const currentDay = format(currentDate, 'EEEE');

    // Parse working hours
    const [startHours, startMinutes] = restaurant.workingHoursStart?.split(':') || ['0', '0'];
    const [endHours, endMinutes] = restaurant.workingHoursEnd?.split(':') || ['0', '0'];

    const todayStart = setHours(setMinutes(new Date(), parseInt(startMinutes)), parseInt(startHours));
    const todayEnd = setHours(setMinutes(new Date(), parseInt(endMinutes)), parseInt(endHours));

    const isWorkingDay = restaurant.workingDays?.includes(currentDay);
    const minutesToOpen = differenceInMinutes(todayStart, currentDate);
    const minutesToClose = differenceInMinutes(todayEnd, currentDate);
    const hoursToOpen = Math.floor(Math.abs(minutesToOpen) / 60);
    const hoursToClose = Math.floor(Math.abs(minutesToClose) / 60);
    const minutesRemainderToOpen = Math.abs(minutesToOpen) % 60;
    const minutesRemainderToClose = Math.abs(minutesToClose) % 60;

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayIndex = daysOfWeek.indexOf(currentDay);
    const nextWorkingDay = restaurant.workingDays?.find(day =>
        daysOfWeek.indexOf(day) > currentDayIndex
    ) || restaurant.workingDays?.[0];

    const ListingsInCart = selectedRestaurantListings.filter(listing =>
        cartItems.some(cartItem => cartItem.listing_id === listing.id)
    );

    // Calculate totals
    const totalPickUpPrice = ListingsInCart.reduce((sum, item) => {
        const cartItem = cartItems.find(ci => ci.listing_id === item.id);
        const quantity = cartItem?.count || 1;
        return sum + (item.pick_up_price || 0) * quantity;
    }, 0);

    const totalDeliveryPrice = ListingsInCart.reduce((sum, item) => {
        const cartItem = cartItems.find(ci => ci.listing_id === item.id);
        const quantity = cartItem?.count || 1;
        return sum + (item.delivery_price || 0) * quantity;
    }, 0);

    const currentTotal = isPickup ? totalPickUpPrice : totalDeliveryPrice;
    const deliveryFee = !isPickup ? restaurant?.deliveryFee || 0 : 0;
    const subtotal = currentTotal + deliveryFee;

    // Calculate Flash Deal discount
    const calculateFlashDealDiscount = () => {
        if (!flashDealsEnabled || !restaurant.flash_deals_available) return 0;

        if (subtotal >= 400) return 150;
        if (subtotal >= 250) return 100;
        if (subtotal >= 200) return 75;
        if (subtotal >= 150) return 50;

        return 0;
    };

    const flashDealDiscount = calculateFlashDealDiscount();
    const finalTotal = subtotal - flashDealDiscount;

    const toggleFlashDeals = () => {
        if (restaurant.flash_deals_available) {
            setFlashDealsEnabled(!flashDealsEnabled);
        }
    };

    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod(method);
        if (method === 'card') {
            setIsCardAdded(true);

            // Simulate card added notification
            const notification = document.getElementById('card-notification');
            if (notification) {
                notification.classList.add('show');

                setTimeout(() => {
                    notification.classList.remove('show');
                }, 2000);
            }
        }
    };

    const handleCompletePurchase = async () => {
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        if (!isWorkingDay || isBefore(currentDate, todayStart) || isAfter(currentDate, todayEnd)) {
            alert('Restaurant is currently closed');
            return;
        }

        try {
            await dispatch(createPurchaseOrderAsync({
                isDelivery: !isPickup,
                notes: deliveryNotes ? deliveryNotes : " ",
                flashDealsActivated: flashDealsEnabled
            }));

            setShowSuccess(true);
        } catch (error) {
            alert(error.message || 'Error creating purchase order');
        }
    };

    const handleAnimationComplete = () => {
        navigate('/', { replace: true });
    };

    const renderRestaurantStatus = () => {
        if (!isWorkingDay) {
            return (
                <div className="status-container error-status">
                    <i className="bi bi-exclamation-triangle"></i>
                    <span>
                        Restaurant is closed today. Next open on {nextWorkingDay}
                    </span>
                </div>
            );
        }

        const isBeforeOpening = isBefore(currentDate, todayStart);
        const isAfterClosing = isAfter(currentDate, todayEnd);

        if (isBeforeOpening) {
            return (
                <div className={`status-container ${minutesToOpen <= 120 ? 'soon-status' : ''}`}>
                    <i className="bi bi-clock"></i>
                    <span>
                        {minutesToOpen <= 120
                            ? `Opening soon (${hoursToOpen}h ${minutesRemainderToOpen}m)`
                            : `Opens at ${restaurant.workingHoursStart}`
                        }
                    </span>
                </div>
            );
        }

        if (isAfterClosing) {
            return (
                <div className="status-container error-status">
                    <i className="bi bi-exclamation-triangle"></i>
                    <span>
                        Restaurant is closed. Opens {nextWorkingDay} at {restaurant.workingHoursStart}
                    </span>
                </div>
            );
        }

        if (minutesToClose <= 120) {
            return (
                <div className="status-container closing-soon-status">
                    <i className="bi bi-clock"></i>
                    <span>
                        Closing soon ({hoursToClose}h {minutesRemainderToClose}m)
                    </span>
                </div>
            );
        }

        return (
            <div className="status-container open-status">
                <i className="bi bi-check-circle"></i>
                <span>
                    Open until {restaurant.workingHoursEnd}
                </span>
            </div>
        );
    };

    if (showSuccess) {
        return <CheckoutSuccess onAnimationComplete={handleAnimationComplete} />;
    }

    return (
        <div className="checkout-container">
            <div className="container py-4">
                <div className="checkout-header">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <h1 className="checkout-title">Checkout</h1>
                    <div style={{ width: '32px' }}></div>
                </div>

                <div className="checkout-content">
                    <div className="row">
                        <div className="col-lg-8">
                            {renderRestaurantStatus()}

                            <div className="card order-summary-card">
                                <div className="card-body">
                                    <h2 className="section-title">Order Summary</h2>

                                    <div className="restaurant-info">
                                        <i className="bi bi-shop"></i>
                                        <span className="restaurant-name">
                                            {restaurant.restaurantName || 'Restaurant'}
                                        </span>
                                    </div>

                                    <div className="order-type-tag">
                                        <i className={`bi ${isPickup ? 'bi-bag' : 'bi-truck'}`}></i>
                                        <span>{isPickup ? 'Pickup' : 'Delivery'}</span>
                                    </div>

                                    <div className="order-items">
                                        {ListingsInCart.map(listing => {
                                            const cartItem = cartItems.find(ci => ci.listing_id === listing.id);
                                            const quantity = cartItem?.count || 1;
                                            const price = isPickup ?
                                                listing.pick_up_price || 0 :
                                                listing.delivery_price || 0;

                                            return (
                                                <div key={listing.id} className="order-item">
                                                    <div className="order-item-details">
                                                        <span className="order-item-quantity">{quantity}x</span>
                                                        <span className="order-item-name">{listing.title}</span>
                                                    </div>
                                                    <span className="order-item-price">
                                                        {(price * quantity).toFixed(2)} TL
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        <hr className="divider" />

                                        <div className="summary-row">
                                            <span className="summary-label">Subtotal</span>
                                            <span className="summary-value">{currentTotal.toFixed(2)} TL</span>
                                        </div>

                                        {!isPickup && restaurant && restaurant.deliveryFee > 0 && (
                                            <div className="summary-row">
                                                <span className="summary-label">Delivery Fee</span>
                                                <span className="summary-value">{restaurant.deliveryFee.toFixed(2)} TL</span>
                                            </div>
                                        )}

                                        {restaurant.flash_deals_available && (
                                            <div className="flash-deals-container">
                                                <div className="flash-deals-header">
                                                    <i className="bi bi-lightning-charge-fill text-danger"></i>
                                                    <h3 className="flash-deals-title">Flash Deals</h3>
                                                    <button
                                                        className={`flash-deals-toggle ${flashDealsEnabled ? 'active' : ''}`}
                                                        onClick={toggleFlashDeals}
                                                    >
                                                        {flashDealsEnabled ? 'ON' : 'OFF'}
                                                    </button>
                                                </div>

                                                <p className="flash-deals-description">
                                                    Flash Deals provide discounts based on order total:
                                                </p>
                                                <ul className="flash-deals-list">
                                                    <li>150+ TL: 50 TL off</li>
                                                    <li>200+ TL: 75 TL off</li>
                                                    <li>250+ TL: 100 TL off</li>
                                                    <li>400+ TL: 150 TL off</li>
                                                </ul>

                                                {flashDealsEnabled && flashDealDiscount > 0 && (
                                                    <div className="discount-row">
                                                        <span className="discount-label">Flash Deal Discount</span>
                                                        <span className="discount-value">-{flashDealDiscount.toFixed(2)} TL</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="total-row">
                                        <span className="total-label">TOTAL</span>
                                        <span className="total-amount">{finalTotal.toFixed(2)} TL</span>
                                    </div>
                                </div>
                            </div>

                            {!isPickup && selectedAddress && (
                                <div className="card delivery-address-card">
                                    <div className="card-body">
                                        <h2 className="section-title">Delivery Address</h2>
                                        <div className="address-display">
                                            <i className="bi bi-geo-alt"></i>
                                            <span className="address-text">
                                                {serializeAddressForDelivery(selectedAddress)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isPickup && (
                                <div className="card notes-card">
                                    <div className="card-body">
                                        <h2 className="section-title">Delivery Notes</h2>
                                        <textarea
                                            className="form-control notes-input"
                                            placeholder="Add delivery instructions..."
                                            value={deliveryNotes}
                                            onChange={(e) => setDeliveryNotes(e.target.value)}
                                            rows="4"
                                        ></textarea>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-lg-4">
                            <div className="card payment-card">
                                <div className="card-body">
                                    <h2 className="section-title">Payment Method</h2>

                                    {isPickup ? (
                                        <>
                                            <div
                                                className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                                                onClick={() => handlePaymentMethodSelect('card')}
                                            >
                                                <i className="bi bi-credit-card"></i>
                                                <span className="payment-text">Pay Now</span>
                                                {isCardAdded && paymentMethod === 'card' && (
                                                    <i className="bi bi-check-circle-fill"></i>
                                                )}
                                            </div>

                                            <div
                                                className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                                                onClick={() => handlePaymentMethodSelect('cash')}
                                            >
                                                <i className="bi bi-cash"></i>
                                                <span className="payment-text">Pay at Pickup</span>
                                                {paymentMethod === 'cash' && (
                                                    <i className="bi bi-check-circle-fill"></i>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                                                onClick={() => handlePaymentMethodSelect('card')}
                                            >
                                                <i className="bi bi-credit-card"></i>
                                                <span className="payment-text">Credit Card</span>
                                                {isCardAdded && paymentMethod === 'card' && (
                                                    <i className="bi bi-check-circle-fill"></i>
                                                )}
                                            </div>

                                            <div
                                                className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                                                onClick={() => handlePaymentMethodSelect('cash')}
                                            >
                                                <i className="bi bi-cash"></i>
                                                <span className="payment-text">Cash on Delivery</span>
                                                {paymentMethod === 'cash' && (
                                                    <i className="bi bi-check-circle-fill"></i>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <button
                                        className={`complete-button ${(!isWorkingDay || !paymentMethod || isBefore(currentDate, todayStart) || isAfter(currentDate, todayEnd)) ? 'disabled' : ''}`}
                                        onClick={handleCompletePurchase}
                                        disabled={!isWorkingDay || !paymentMethod || isBefore(currentDate, todayStart) || isAfter(currentDate, todayEnd)}
                                    >
                                        Complete Purchase
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="card-notification" className="card-notification">
                <i className="bi bi-check-circle-fill"></i>
                <span>Card added successfully</span>
            </div>

            <style jsx>{`
                .checkout-container {
                    background-color: #F9FAFB;
                    min-height: 100vh;
                    padding-bottom: 40px;
                }
                
                .checkout-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .btn-back {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #6B7280;
                    padding: 8px;
                }
                
                .checkout-title {
                    flex: 1;
                    text-align: center;
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                }
                
                .checkout-content {
                    margin-bottom: 30px;
                }
                
                .card {
                    border-radius: 16px;
                    border: none;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    margin-bottom: 20px;
                    overflow: hidden;
                }
                
                .card-body {
                    padding: 20px;
                }
                
                .section-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 16px;
                }
                
                .status-container {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    background-color: #FFFFFF;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    font-size: 15px;
                    color: #4B5563;
                }
                
                .status-container i {
                    font-size: 20px;
                    margin-right: 8px;
                }
                
                .soon-status {
                    background-color: #F0F9EB;
                    color: #50703C;
                    font-weight: 600;
                }
                
                .closing-soon-status {
                    background-color: #FEF2F2;
                    color: #DC2626;
                    font-weight: 600;
                }
                
                .error-status {
                    background-color: #FEF2F2;
                    color: #DC2626;
                    font-weight: 600;
                }
                
                .open-status {
                    color: #50703C;
                }
                
                .restaurant-info {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                }
                
                .restaurant-info i {
                    font-size: 20px;
                    color: #50703C;
                    margin-right: 10px;
                }
                
                .restaurant-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #111827;
                }
                
                .order-type-tag {
                    display: inline-flex;
                    align-items: center;
                    background-color: #50703C;
                    color: white;
                    padding: 6px 14px;
                    border-radius: 20px;
                    margin-bottom: 20px;
                }
                
                .order-type-tag i {
                    font-size: 16px;
                    margin-right: 6px;
                }
                
                .order-items {
                    margin-bottom: 20px;
                }
                
                .order-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }
                
                .order-item-details {
                    display: flex;
                    align-items: center;
                    flex: 1;
                }
                
                .order-item-quantity {
                    font-size: 15px;
                    font-weight: 600;
                    color: #50703C;
                    margin-right: 10px;
                    width: 24px;
                    display: inline-block;
                }
                
                .order-item-name {
                    font-size: 15px;
                    color: #4B5563;
                }
                
                .order-item-price {
                    font-size: 15px;
                    color: #111827;
                    font-weight: 500;
                }
                
                .divider {
                    margin: 16px 0;
                    border-top: 1px solid #F3F4F6;
                    opacity: 1;
                }
                
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }
                
                .summary-label {
                    font-size: 15px;
                    color: #4B5563;
                }
                
                .summary-value {
                    font-size: 15px;
                    color: #111827;
                    font-weight: 500;
                }
                
                .flash-deals-container {
                    margin-top: 16px;
                    padding: 16px;
                    background-color: #FFF9F9;
                    border-radius: 10px;
                    border: 1px solid #FFEEEE;
                }
                
                .flash-deals-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                }
                
                .flash-deals-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #FF5252;
                    margin: 0 0 0 10px;
                    flex: 1;
                }
                
                .flash-deals-toggle {
                    background-color: #F5F5F5;
                    padding: 4px 12px;
                    border-radius: 12px;
                    border: none;
                    font-size: 12px;
                    font-weight: 600;
                    color: #777;
                    cursor: pointer;
                }
                
                .flash-deals-toggle.active {
                    background-color: #FFD7D7;
                    color: #FF5252;
                }
                
                .flash-deals-description {
                    font-size: 14px;
                    color: #555;
                    margin-bottom: 8px;
                }
                
                .flash-deals-list {
                    margin-bottom: 16px;
                    padding-left: 20px;
                }
                
                .flash-deals-list li {
                    font-size: 13px;
                    color: #666;
                    margin-bottom: 4px;
                }
                
                .discount-row {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px dashed #FFCCCC;
                }
                
                .discount-label {
                    font-size: 15px;
                    color: #FF5252;
                    font-weight: 600;
                }
                
                .discount-value {
                    font-size: 15px;
                    color: #FF5252;
                    font-weight: 600;
                }
                
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #F3F4F6;
                }
                
                .total-label {
                    font-size: 16px;
                    font-weight: 600;
                    color: #111827;
                }
                
                .total-amount {
                    font-size: 22px;
                    font-weight: 700;
                    color: #50703C;
                }
                
                .address-display {
                    display: flex;
                    align-items: flex-start;
                }
                
                .address-display i {
                    font-size: 20px;
                    color: #50703C;
                    margin-right: 12px;
                    margin-top: 3px;
                }
                
                .address-text {
                    font-size: 15px;
                    color: #4B5563;
                    line-height: 1.6;
                }
                
                .notes-input {
                    min-height: 120px;
                    resize: none;
                    border: 1px solid #E5E7EB;
                    border-radius: 8px;
                    padding: 12px;
                    font-size: 15px;
                    color: #4B5563;
                }
                
                .payment-option {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    background-color: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .payment-option:hover {
                    border-color: #D1D5DB;
                    background-color: #F9FAFB;
                }
                
                .payment-option.selected {
                    background-color: #F0F9EB;
                    border-color: #50703C;
                }
                
                .payment-option i {
                    font-size: 20px;
                    color: #50703C;
                    margin-right: 12px;
                }
                
                .payment-text {
                    flex: 1;
                    font-size: 16px;
                    color: #4B5563;
                }
                
                .complete-button {
                    background-color: #50703C;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 16px;
                    font-size: 18px;
                    font-weight: 600;
                    width: 100%;
                    margin-top: 20px;
                    cursor: pointer;
                }
                
                .complete-button:hover {
                    background-color: #455f31;
                }
                
                .complete-button.disabled {
                    background-color: #D1D5DB;
                    cursor: not-allowed;
                }
                
                .card-notification {
                    position: fixed;
                    top: -100px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #50703C;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: top 0.3s ease;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .card-notification.show {
                    top: 20px;
                }
                
                @media (max-width: 768px) {
                    .checkout-header {
                        margin-bottom: 16px;
                    }
                    
                    .checkout-title {
                        font-size: 22px;
                    }
                    
                    .section-title {
                        font-size: 18px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Checkout;