import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

function RestaurantDetailsMap() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);

  // Get the selected restaurant and user address from Redux store
  const restaurant = useSelector((state) => state.restaurant.selectedRestaurant);
  const addressState = useSelector((state) => state.address);
  const selectedAddress = addressState.addresses.find(
    (address) => address.is_primary
  );

  // Set up user coordinates
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

  // Initialize Leaflet map and load routing plugin
  useEffect(() => {
    if (!userCoordinates || !restaurant?.latitude || !restaurant?.longitude) return;

    const loadLeaflet = async () => {
      if (window.L) return;

      // Load Leaflet CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Load Leaflet JS
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    const loadRoutingPlugin = async () => {
      if (window.L && window.L.Routing) return;

      // Load Leaflet Routing Machine CSS
      const routingCssLink = document.createElement('link');
      routingCssLink.rel = 'stylesheet';
      routingCssLink.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css';
      document.head.appendChild(routingCssLink);

      // Load Leaflet Routing Machine JS
      return new Promise((resolve) => {
        const routingScript = document.createElement('script');
        routingScript.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js';
        routingScript.onload = resolve;
        document.head.appendChild(routingScript);
      });
    };

    const initMap = async () => {
      await loadLeaflet();
      await loadRoutingPlugin();

      if (!window.L || !mapRef.current || map) return;

      const newMap = window.L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView([restaurant.latitude, restaurant.longitude], 14);

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(newMap);

      // Create user marker
      const userIcon = window.L.divIcon({
        html: `<div class="user-marker-pulse"><div class="user-marker-inner"></div></div>`,
        className: 'user-marker-container',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      window.L.marker([userCoordinates.latitude, userCoordinates.longitude], { icon: userIcon })
        .addTo(newMap)
        .bindPopup("Your location");

      // Create restaurant marker
      const restaurantIcon = window.L.divIcon({
        html: `
          <div class="restaurant-circle-marker selected">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#FFFFFF">
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
            </svg>
          </div>
        `,
        className: 'restaurant-marker-container',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      window.L.marker([restaurant.latitude, restaurant.longitude], { icon: restaurantIcon })
        .addTo(newMap)
        .bindPopup(restaurant.restaurantName || "Restaurant");

      // Calculate and display the route between user and restaurant
      if (window.L.Routing) {
        if (routingControl) {
          newMap.removeControl(routingControl);
        }

        const newRoutingControl = window.L.Routing.control({
          waypoints: [
            window.L.latLng(userCoordinates.latitude, userCoordinates.longitude),
            window.L.latLng(restaurant.latitude, restaurant.longitude)
          ],
          routeWhileDragging: false,
          showAlternatives: false,
          lineOptions: {
            styles: [
              { color: '#50703C', opacity: 0.8, weight: 5 }
            ]
          },
          createMarker: function() { return null; }, // Don't create default markers
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true
        }).addTo(newMap);

        setRoutingControl(newRoutingControl);

        // Hide the sidebar with route instructions
        newRoutingControl.on('routesfound', function() {
          const container = document.querySelector('.leaflet-routing-container');
          if (container) {
            container.style.display = 'none';
          }
        });
      }

      // Center the map to show both markers
      const bounds = window.L.latLngBounds(
        [userCoordinates.latitude, userCoordinates.longitude],
        [restaurant.latitude, restaurant.longitude]
      );
      newMap.fitBounds(bounds, { padding: [50, 50] });

      setMap(newMap);
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [userCoordinates, restaurant, map, routingControl]);

  return (
    <div className="restaurant-details-map">
      <div ref={mapRef} style={{ height: "300px", width: "100%", borderRadius: "12px" }}></div>
    </div>
  );
}

export default RestaurantDetailsMap;
