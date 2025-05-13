// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import ScrollToTop from "@src/pages/ScrollToTop";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useDispatch, useSelector } from "react-redux";
import { addAddressAsync, updateAddress } from "@src/redux/thunks/addressThunks";
import { Navigate } from "react-router-dom";
import { tokenService } from "@src/services/tokenService.js";
import { getUserDataThunk } from "@src/redux/thunks/userThunks";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

const LocationButton = () => {
  const map = useMap();

  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map.panTo(pos);
            map.setZoom(15);

            const event = new CustomEvent('locationUpdated', {
              detail: { latLng: pos }
            });
            window.dispatchEvent(event);
          },
          () => {
            alert("Error: The Geolocation service failed.");
          }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  return (
      <button
          onClick={handleClick}
          className="my-location-button"
          title="My Location"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        </svg>
      </button>
  );
};

const AddressSelection = () => {
  // Redux
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.address.addresses);
  const addressLoading = useSelector((state) => state.address.loading);
  const token = useSelector((state) => state.user.token);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // States for component
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [coordinates, setCoordinates] = useState({ lat: 39.92077, lng: 32.85411 });
  const [addressData, setAddressData] = useState(null);
  const [apartmentNo, setApartmentNo] = useState(null);
  const [doorNo, setDoorNo] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Address Selection - Authentication check:", { token, isAuthenticated });

      // Check if there's a token in localStorage but not in Redux
      const storedToken = await tokenService.getToken();
      if (storedToken && !token) {
        dispatch(getUserDataThunk({ token: storedToken }));
        return; // Wait for the token to be processed
      }

      // Only redirect if we're sure there's no token
      if (!storedToken && !token) {
        setRedirectToLogin(true);
      }
    };

    checkAuth();
  }, [token, isAuthenticated, dispatch]);

  // Loading effect
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  // Listen for location updates
  useEffect(() => {
    const handleLocationUpdated = (event) => {
      if (event.detail && event.detail.latLng) {
        setCoordinates(event.detail.latLng);
        getAddressFromCoordinates(event.detail.latLng.lat, event.detail.latLng.lng);
      }
    };

    window.addEventListener('locationUpdated', handleLocationUpdated);

    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdated);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (mapInitialized && coordinates) {
      getAddressFromCoordinates(coordinates.lat, coordinates.lng);
    }
  }, [mapInitialized]);

  if (redirectToLogin) {
    return <Navigate to="/Login" />;
  }

  const handleMapLoad = () => {
    setMapInitialized(true);
  };

  const handleClick = (event) => {
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;
    setCoordinates({ lat, lng });
    getAddressFromCoordinates(lat, lng);
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components || [];

        // Extract each component properly
        const formattedAddress = {
          title: "Home",
          longitude: lng,
          latitude: lat,
          street: extractAddressComponent(addressComponents, ["route"]) || "Unknown street",
          neighborhood: extractAddressComponent(addressComponents, ["neighborhood", "sublocality_level_2"]) || "Unknown neighborhood",
          district: extractAddressComponent(addressComponents, ["sublocality", "sublocality_level_1"]) || "Unknown district",
          province: extractAddressComponent(addressComponents, ["administrative_area_level_1"]) || "Unknown province",
          country: extractAddressComponent(addressComponents, ["country"]) || "Unknown country",
          postalCode: extractAddressComponent(addressComponents, ["postal_code"]) || "Unknown postal code",
          apartmentNo: apartmentNo,
          doorNo: doorNo,
          isPrimary: true,
          formattedAddress: result.formatted_address || ""
        };
        setAddressData(formattedAddress);
      } else {
        setAddressData({
          error: `Address could not be retrieved. Error: ${data.status}`
        });
      }
    } catch (error) {
      setAddressData({ error: "An error occurred: " + error.message });
    }
  };

  const extractAddressComponent = (components, types) => {
    if (!components || !Array.isArray(components)) return null;

    for (const type of types) {
      const component = components.find(comp =>
          comp.types && comp.types.includes(type)
      );

      if (component) {
        return component.long_name;
      }
    }

    return null;
  };

  const saveAddress = async () => {
    if (!token) {
      setRedirectToLogin(true);
      return;
    }

    const addressPayload = {
      ...addressData,
      token
    };

    dispatch(addAddressAsync(addressPayload));
  }

  const selectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(address => address.id === addressId);
    if (selectedAddress) {
      setCoordinates({
        lat: selectedAddress.latitude || 39.92077,
        lng: selectedAddress.longitude || 32.85411
      });

      // Set this address as primary
      setPrimaryAddress(addressId);
    }
  };

  // New function to set an address as primary
  const setPrimaryAddress = (addressId) => {
    const selectedAddress = addresses.find(address => address.id === addressId);
    if (selectedAddress && !selectedAddress.is_primary) {
      // Only update if it's not already primary
      dispatch(updateAddress({
        id: addressId,
        updates: { is_primary: true }
      }));
    }
  };

  return (
      <div>
        <ScrollToTop/>
        <div className="address-selection-container">
          <div className="container py-5">
            <div className="row">
              <div className="col-12 mb-4">
                <h2 className="address-title">Manage Your Addresses</h2>
                <p className="address-subtitle">Select a location on the map or choose from your saved addresses</p>
              </div>
            </div>

            <div className="row">
              {/* Address List Sidebar */}
              <div className="col-lg-4 mb-4">
                <div className="address-sidebar">
                  <div className="sidebar-header">
                    <h3>Your Addresses</h3>
                    {addresses.length === 0 && (
                        <div className="no-addresses">
                          <p>You don't have any saved addresses yet.</p>
                          <p>Click on the map to add your first address.</p>
                        </div>
                    )}
                  </div>

                  <div className="address-list">
                    {addresses.map((address) => (
                        <div
                            className={`address-card ${selectedAddressId === address.id ? 'selected' : ''}`}
                            key={address.id}
                            onClick={() => selectAddress(address.id)}
                        >
                          <div className="address-card-content">
                            <div className="address-card-header">
                              <h4>{address.title}</h4>
                              {address.is_primary && <span className="primary-badge">Primary</span>}
                            </div>
                            <div className="address-card-body">
                              <p>{address.street}, {address.neighborhood}</p>
                              <p>{address.district}, {address.province}</p>
                              <p>{address.country}, {address.postalCode}</p>
                              {(address.apartmentNo || address.doorNo) && (
                                  <p className="address-details">
                                    {address.apartmentNo && `Apt ${address.apartmentNo}`}
                                    {address.apartmentNo && address.doorNo && ', '}
                                    {address.doorNo && `Door ${address.doorNo}`}
                                  </p>
                              )}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map and Address Form */}
              <div className="col-lg-8">
                <div className="map-container">
                  <div className="map-instructions">
                    <i className="bi bi-geo-alt"></i>
                    <span>Click anywhere on the map to set your address</span>
                  </div>

                  <APIProvider apiKey={apiKey}>
                    <Map
                        onClick={handleClick}
                        style={mapContainerStyle}
                        gestureHandling="greedy"
                        onLoad={handleMapLoad}
                        defaultZoom={15}
                        defaultCenter={coordinates}
                    >
                      <Marker position={coordinates} />
                      <LocationButton />
                    </Map>
                  </APIProvider>
                </div>

                {addressData && !addressData.error && (
                    <div className="address-form">
                      <h3>Address Details</h3>

                      {addressData.formattedAddress && (
                          <div className="full-address-display">
                            <p>{addressData.formattedAddress}</p>
                          </div>
                      )}

                      <div className="address-form-grid">
                        <div className="form-group">
                          <label>Street</label>
                          <p className="form-value">{addressData.street}</p>
                        </div>

                        <div className="form-group">
                          <label>Neighborhood</label>
                          <p className="form-value">{addressData.neighborhood}</p>
                        </div>

                        <div className="form-group">
                          <label>District</label>
                          <p className="form-value">{addressData.district}</p>
                        </div>

                        <div className="form-group">
                          <label>Province</label>
                          <p className="form-value">{addressData.province}</p>
                        </div>

                        <div className="form-group">
                          <label>Country</label>
                          <p className="form-value">{addressData.country}</p>
                        </div>

                        <div className="form-group">
                          <label>Postal Code</label>
                          <p className="form-value">{addressData.postalCode}</p>
                        </div>
                      </div>

                      <div className="row mt-4">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Apartment No (Optional)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={apartmentNo || ""}
                                onChange={(e) => {
                                  setApartmentNo(e.target.value);
                                  setAddressData({
                                    ...addressData,
                                    apartmentNo: e.target.value,
                                  });
                                }}
                                placeholder="Enter apartment number"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Door No (Optional)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={doorNo || ""}
                                onChange={(e) => {
                                  setDoorNo(e.target.value);
                                  setAddressData({
                                    ...addressData,
                                    doorNo: e.target.value,
                                  });
                                }}
                                placeholder="Enter door number"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="save-address-container">
                        <button
                            className="save-address-btn"
                            onClick={saveAddress}
                            disabled={addressLoading}
                        >
                          {addressLoading ? (
                              <>
                                <span className="spinner"></span>
                                <span>Saving...</span>
                              </>
                          ) : (
                              <>
                                <i className="bi bi-check2-circle"></i>
                                <span>Save Address</span>
                              </>
                          )}
                        </button>
                      </div>
                    </div>
                )}

                {addressData && addressData.error && (
                    <div className="error-alert">
                      <i className="bi bi-exclamation-triangle"></i>
                      <span>{addressData.error}</span>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .address-selection-container {
            background-color: #f8f9fa;
            min-height: 100vh;
          }

          .address-title {
            font-size: 2.25rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }

          .address-subtitle {
            font-size: 1rem;
            color: #718096;
            margin-bottom: 2rem;
          }

          .address-sidebar {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            padding: 1.5rem;
            height: 100%;
            max-height: 700px;
            overflow-y: auto;
          }

          .sidebar-header {
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 1rem;
          }

          .sidebar-header h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }

          .no-addresses {
            padding: 1rem 0;
            color: #718096;
          }

          .address-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .address-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .address-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }

          .address-card.selected {
            border-color: #3182ce;
            background-color: #ebf8ff;
          }

          .address-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }

          .address-card-header h4 {
            font-size: 1.125rem;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
          }

          .primary-badge {
            background-color: #38a169;
            color: white;
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
          }

          .address-card-body p {
            margin: 0.25rem 0;
            font-size: 0.875rem;
            color: #4a5568;
          }

          .address-details {
            margin-top: 0.5rem;
            font-style: italic;
            color: #718096;
          }

          .map-container {
            position: relative;
            margin-bottom: 1.5rem;
          }

          .map-instructions {
            position: absolute;
            top: 1rem;
            left: 1rem;
            z-index: 1000;
            background-color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
          }

          .my-location-button {
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 1000;
            background-color: white;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            border: none;
            cursor: pointer;
            color: #3182ce;
            transition: all 0.2s ease;
          }

          .my-location-button:hover {
            background-color: #f7fafc;
            color: #2b6cb0;
          }

          .address-form {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            padding: 1.5rem;
          }

          .address-form h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 1.5rem;
          }

          .full-address-display {
            background-color: #f7fafc;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            border-left: 4px solid #3182ce;
          }

          .full-address-display p {
            margin: 0;
            color: #4a5568;
            font-size: 1rem;
          }

          .address-form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: #4a5568;
          }

          .form-value {
            font-size: 1rem;
            color: #2d3748;
            font-weight: 500;
          }

          .form-control {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 1rem;
            transition: all 0.2s ease;
          }

          .form-control:focus {
            border-color: #3182ce;
            box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
            outline: none;
          }

          .save-address-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 1.5rem;
          }

          .save-address-btn {
            background-color: #3182ce;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .save-address-btn:hover:not(:disabled) {
            background-color: #2c5282;
          }

          .save-address-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .spinner {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .error-alert {
            background-color: #fff5f5;
            border: 1px solid #feb2b2;
            color: #c53030;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
        `}</style>
      </div>
  );
};

export default AddressSelection;