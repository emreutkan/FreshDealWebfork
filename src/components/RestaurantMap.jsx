import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedRestaurant } from "../redux/slices/restaurantSlice";
import { getRestaurantThunk } from "../redux/thunks/restaurantThunks";
import { isRestaurantOpen } from "../utils/RestaurantFilters";

function RestaurantMap() {
    const dispatch = useDispatch();
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const [userCoordinates, setUserCoordinates] = useState(null);

    const restaurants = useSelector((state) => state.restaurant.restaurantsProximity);
    const addressState = useSelector((state) => state.address);
    const selectedAddress = addressState.addresses.find(
        (address) => address.id === addressState.selectedAddressId
    );

    useEffect(() => {
        const izmirKarsiyaka = {
            latitude: 38.4582,
            longitude: 27.1211
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                () => {
                    if (selectedAddress?.latitude && selectedAddress?.longitude) {
                        setUserCoordinates({
                            latitude: selectedAddress.latitude,
                            longitude: selectedAddress.longitude
                        });
                    } else {
                        setUserCoordinates(izmirKarsiyaka);
                    }
                }
            );
        } else {
            if (selectedAddress?.latitude && selectedAddress?.longitude) {
                setUserCoordinates({
                    latitude: selectedAddress.latitude,
                    longitude: selectedAddress.longitude
                });
            } else {
                setUserCoordinates(izmirKarsiyaka);
            }
        }
    }, [selectedAddress]);

    useEffect(() => {
        if (!userCoordinates) return;

        const loadLeaflet = async () => {
            if (window.L) return;

            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            cssLink.crossOrigin = '';
            document.head.appendChild(cssLink);

            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                script.crossOrigin = '';
                script.onload = resolve;
                document.head.appendChild(script);
            });
        };

        const initMap = async () => {
            await loadLeaflet();

            if (!window.L || !mapRef.current || map) return;

            const newMap = window.L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView([userCoordinates.latitude, userCoordinates.longitude], 14);

            window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
                attribution: '',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(newMap);

            window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
                attribution: '',
                subdomains: 'abcd',
                maxZoom: 19,
                pane: 'shadowPane'
            }).addTo(newMap);

            const userIcon = window.L.divIcon({
                html: `<div class="user-marker-pulse"><div class="user-marker-inner"></div></div>`,
                className: 'user-marker-container',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            window.L.marker([userCoordinates.latitude, userCoordinates.longitude], { icon: userIcon })
                .addTo(newMap)
                .bindPopup("Your location");

            setMap(newMap);
        };

        initMap();

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [userCoordinates, map]);

    useEffect(() => {
        if (!map || !restaurants || restaurants.length === 0) return;

        map.eachLayer(layer => {
            if (layer._icon && layer._icon.classList.contains('restaurant-marker')) {
                map.removeLayer(layer);
            }
        });

        restaurants.forEach(restaurant => {
            if (!restaurant.latitude || !restaurant.longitude) return;

            const isAvailable = isRestaurantOpen(
                restaurant.workingDays,
                restaurant.workingHoursStart,
                restaurant.workingHoursEnd
            ) && restaurant.listings > 0;

            const defaultImageUrl = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF5A5F"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
            const imageUrl = restaurant.image_url || defaultImageUrl;

            const markerIcon = window.L.divIcon({
                html: `
                    <div class="restaurant-circle-marker${isAvailable ? '' : ' unavailable'}${selectedRestaurantId === restaurant.id ? ' selected' : ''}">
                        <img src="${imageUrl}" alt="${restaurant.restaurantName}" onerror="this.onerror=null; this.src='${defaultImageUrl}';">
                    </div>
                `,
                className: 'restaurant-marker-container',
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20]
            });

            const popupContent = document.createElement('div');
            popupContent.className = 'restaurant-popup';
            popupContent.innerHTML = `
                ${restaurant.image_url ? `
                    <div class="restaurant-popup-image">
                        <img src="${restaurant.image_url}" alt="${restaurant.restaurantName}" />
                    </div>
                ` : ''}
                <div class="restaurant-popup-content">
                    <h5>${restaurant.restaurantName}</h5>
                    ${!isAvailable ? `
                        <div class="restaurant-status">
                            <span class="status-indicator closed"></span>
                            <span class="status-text">
                                ${!isRestaurantOpen(
                restaurant.workingDays,
                restaurant.workingHoursStart,
                restaurant.workingHoursEnd
            ) ? "Currently Closed" : restaurant.listings <= 0 ? "Out of Stock" : ""}
                            </span>
                        </div>
                    ` : ''}
                    <div class="restaurant-info">
                        <div class="rating">
                            <i class="bi bi-star-fill me-1"></i>
                            <span>${restaurant.rating?.toFixed(1) || "New"}</span>
                        </div>
                        <div class="distance">
                            <i class="bi bi-geo-alt me-1"></i>
                            <span>${restaurant.distance_km?.toFixed(1)} km</span>
                        </div>
                    </div>
                    ${isAvailable ? `
                        <button class="view-menu-btn">View Menu</button>
                    ` : ''}
                </div>
            `;

            if (isAvailable) {
                const buttonElement = popupContent.querySelector('.view-menu-btn');
                buttonElement.addEventListener('click', () => {
                    dispatch(setSelectedRestaurant(restaurant));
                    window.location.href = `/restaurant/${restaurant.id}`;
                });
            }

            const marker = window.L.marker([restaurant.latitude, restaurant.longitude], { icon: markerIcon })
                .addTo(map)
                .bindPopup(popupContent);

            marker.on('click', () => {
                setSelectedRestaurantId(restaurant.id);
                dispatch(setSelectedRestaurant(restaurant));
                dispatch(getRestaurantThunk(restaurant.id));

                map.eachLayer(layer => {
                    if (layer._icon && layer._icon.classList.contains('restaurant-marker')) {
                        const markerElement = layer._icon.querySelector('.restaurant-circle-marker');
                        if (markerElement) {
                            if (layer === marker) {
                                markerElement.classList.add('selected');
                            } else {
                                markerElement.classList.remove('selected');
                            }
                        }
                    }
                });
            });
        });

    }, [map, restaurants, selectedRestaurantId, dispatch]);

    const handleRelocate = () => {
        if (!map || !userCoordinates) return;
        map.setView([userCoordinates.latitude, userCoordinates.longitude], 14, {
            animate: true,
            duration: 1
        });
    };

    return (
        <div className="restaurant-map-container mb-4" data-testid="restaurant-map-root">
            <div className="map-header mb-2">
                <h2 className="text-dark fw-bold">Restaurants Near You</h2>
                <p className="lead">Find nearby restaurants with surplus food on the map</p>
            </div>
            <div className="map-wrapper">
                <div ref={mapRef} style={{ height: "400px", width: "100%", borderRadius: "12px" }}></div>
                <button className="relocate-button" onClick={handleRelocate}>
                    <i className="bi bi-geo-alt-fill"></i>
                </button>
            </div>

            <style>{`
                .restaurant-map-container {
                    background-color: #fff;
                    border-radius: 16px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
                    padding: 24px;
                    overflow: hidden;
                    position: relative;
                    margin-top: 20px;
                    transition: all 0.3s ease;
                }
                
                .restaurant-map-container:hover {
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }
                
                .map-header {
                    padding-bottom: 16px;
                    position: relative;
                }
                
                .map-header h2 {
                    font-size: 26px;
                    margin-bottom: 8px;
                    font-weight: 700;
                    color: #2E2E2E;
                    letter-spacing: -0.5px;
                }
                
                .map-header p {
                    font-size: 16px;
                    margin-bottom: 0;
                    color: #747474;
                    font-weight: 400;
                }
                
                .map-wrapper {
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                    position: relative;
                    transition: transform 0.3s ease;
                }
                
                .map-wrapper:hover {
                    transform: scale(1.005);
                }
                
                .relocate-button {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    border-radius: 30px;
                    border: none;
                    background: linear-gradient(135deg, #9BE15D, #00E3AE);
                    color: #003320;
                    font-size: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 6px 16px rgba(0, 227, 174, 0.3);
                    z-index: 1000;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                .relocate-button:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 10px 25px rgba(0, 227, 174, 0.4);
                }
                
                .relocate-button:active {
                    transform: translateY(0) scale(0.95);
                }
                
                .user-marker-container {
                    width: 36px !important;
                    height: 36px !important;
                    margin-left: -18px !important;
                    margin-top: -18px !important;
                    background: transparent !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                .user-marker-pulse {
                    position: relative;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background-color: rgba(0, 227, 174, 0.3);
                    animation: pulse 2.5s infinite cubic-bezier(0.66, 0, 0, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .user-marker-inner {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #00E3AE, #00C48C);
                    border: 3px solid white;
                    box-shadow: 0 0 0 2px rgba(0, 227, 174, 0.5);
                }
                
                @keyframes pulse {
                    0% {
                        transform: scale(0.9);
                        box-shadow: 0 0 0 0 rgba(0, 227, 174, 0.5);
                        opacity: 0.9;
                    }
                    70% {
                        transform: scale(1.3);
                        box-shadow: 0 0 0 20px rgba(0, 227, 174, 0);
                        opacity: 0.3;
                    }
                    100% {
                        transform: scale(0.9);
                        box-shadow: 0 0 0 0 rgba(0, 227, 174, 0);
                        opacity: 0.9;
                    }
                }
                
                .restaurant-marker-container {
                    background: transparent !important;
                }
                
                .restaurant-circle-marker {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: 3px solid #FF5A5F;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    transform-origin: center bottom;
                }
                
                .restaurant-circle-marker img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                
                .restaurant-circle-marker:hover img {
                    transform: scale(1.1);
                }
                
                .restaurant-circle-marker.unavailable {
                    border-color: #AAAAAA;
                    opacity: 0.7;
                    filter: grayscale(80%);
                }
                
                .restaurant-circle-marker.selected {
                    transform: scale(1.25);
                    border-color: #00E3AE;
                    border-width: 4px;
                    box-shadow: 0 6px 18px rgba(0, 227, 174, 0.5);
                    z-index: 1000 !important;
                }
                
                .restaurant-popup {
                    width: 280px;
                    padding: 0;
                    border-radius: 12px;
                    overflow: hidden;
                }
                
                .restaurant-popup-image {
                    width: 100%;
                    height: 140px;
                    overflow: hidden;
                    position: relative;
                }
                
                .restaurant-popup-image:after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 40px;
                    background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
                }
                
                .restaurant-popup-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                
                .restaurant-popup-image img:hover {
                    transform: scale(1.05);
                }
                
                .restaurant-popup-content {
                    padding: 16px;
                }
                
                .restaurant-popup-content h5 {
                    margin: 0 0 12px;
                    font-weight: 700;
                    font-size: 18px;
                    color: #2E2E2E;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                
                .restaurant-status {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    background-color: rgba(255, 68, 68, 0.1);
                    padding: 6px 10px;
                    border-radius: 8px;
                }
                
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 8px;
                }
                
                .status-indicator.closed {
                    background-color: #FF4444;
                    box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.3);
                }
                
                .status-text {
                    font-size: 13px;
                    color: #FF4444;
                    font-weight: 500;
                }
                
                .restaurant-info {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 16px;
                }
                
                .rating {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    color: #333;
                    background-color: #FFF8E0;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-weight: 500;
                    box-shadow: 0 2px 5px rgba(255, 215, 0, 0.2);
                }
                
                .rating i {
                    color: #FFD700;
                    margin-right: 5px;
                }
                
                .distance {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    color: #555;
                    background-color: #F2F2F7;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-weight: 500;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                }
                
                .distance i {
                    margin-right: 5px;
                    color: #666;
                }
                
                .view-menu-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 30px;
                    background: linear-gradient(135deg, #9BE15D, #00E3AE);
                    color: #003320;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0, 227, 174, 0.3);
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    letter-spacing: 0.3px;
                }
                
                .view-menu-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 7px 14px rgba(0, 227, 174, 0.4);
                }
                
                .view-menu-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 6px rgba(0, 227, 174, 0.2);
                }
                
                .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
                }
                
                .leaflet-popup-content {
                    margin: 0;
                    width: auto !important;
                }
                
                .leaflet-popup-tip {
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .leaflet-popup-close-button {
                    width: 26px !important;
                    height: 26px !important;
                    font-size: 18px !important;
                    line-height: 24px !important;
                    color: white !important;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                    transition: transform 0.2s ease;
                }
                
                .leaflet-popup-close-button:hover {
                    transform: scale(1.1);
                }
                
                @media (max-width: 992px) {
                    .restaurant-map-container {
                        padding: 20px;
                        border-radius: 14px;
                    }
                    
                    .map-header h2 {
                        font-size: 24px;
                    }
                    
                    .map-header p {
                        font-size: 15px;
                    }
                }
                
                @media (max-width: 768px) {
                    .restaurant-map-container {
                        padding: 16px;
                        border-radius: 12px;
                    }
                    
                    .map-header {
                        padding-bottom: 12px;
                    }
                    
                    .map-header h2 {
                        font-size: 22px;
                    }
                    
                    .map-header p {
                        font-size: 14px;
                    }
                    
                    .relocate-button {
                        width: 50px;
                        height: 50px;
                        font-size: 20px;
                        bottom: 16px;
                        right: 16px;
                    }
                    
                    .restaurant-popup {
                        width: 250px;
                    }
                    
                    .restaurant-popup-image {
                        height: 120px;
                    }
                    
                    .restaurant-popup-content {
                        padding: 12px;
                    }
                    
                    .restaurant-circle-marker {
                        width: 38px;
                        height: 38px;
                    }
                }
                
                @media (max-width: 480px) {
                    .restaurant-map-container {
                        padding: 12px;
                    }
                    
                    .map-header h2 {
                        font-size: 20px;
                    }
                    
                    .map-header p {
                        font-size: 13px;
                    }
                    
                    .restaurant-popup {
                        width: 220px;
                    }
                    
                    .restaurant-popup-content h5 {
                        font-size: 16px;
                    }
                    
                    .restaurant-popup-image {
                        height: 100px;
                    }
                    
                    .view-menu-btn {
                        padding: 10px;
                        font-size: 14px;
                    }
                    
                    .rating, .distance {
                        font-size: 12px;
                        padding: 4px 8px;
                    }
                }
            `}</style>
        </div>
    );
}

export default RestaurantMap;