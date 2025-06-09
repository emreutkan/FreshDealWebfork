// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";
import ScrollToTop from "@src/pages/ScrollToTop";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useDispatch, useSelector } from "react-redux";
import { addAddressAsync, updateAddress } from "@src/redux/thunks/addressThunks";
import { Navigate, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const addresses = useSelector((state) => state.address.addresses);
  const addressLoading = useSelector((state) => state.address.loading);
  const token = useSelector((state) => state.user.token);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // States for component
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [, setLoaderStatus] = useState(true);
  const [coordinates, setCoordinates] = useState({ lat: 39.92077, lng: 32.85411 });
  const [addressData, setAddressData] = useState(null);
  const [apartmentNo, setApartmentNo] = useState(null);
  const [doorNo, setDoorNo] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

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

        // Process all results to ensure we get the most detailed address information
        // Sometimes the most detailed info isn't in the first result
        let streetName = '';
        let neighborhood = '';
        let district = '';
        let province = '';
        let country = '';
        let postalCode = '';

        // Search through multiple results to find the best data
        for (const res of data.results) {
          const addressComponents = res.address_components || [];

          // Try to get street name first
          if (!streetName) {
            streetName = extractAddressComponent(addressComponents, ["route"]);
          }

          // Try to get neighborhood
          if (!neighborhood) {
            neighborhood = extractAddressComponent(addressComponents, ["neighborhood", "sublocality_level_2", "sublocality_level_3"]);
          }

          // Try to get district
          if (!district) {
            district = extractAddressComponent(addressComponents, ["sublocality", "sublocality_level_1", "political", "locality"]);
          }

          // Try to get province/state
          if (!province) {
            province = extractAddressComponent(addressComponents, ["administrative_area_level_1"]);
          }

          // Try to get country
          if (!country) {
            country = extractAddressComponent(addressComponents, ["country"]);
          }

          // Try to get postal code
          if (!postalCode) {
            postalCode = extractAddressComponent(addressComponents, ["postal_code"]);
          }
        }

        // If street name is still empty, try to use the street number or premise
        if (!streetName) {
          for (const res of data.results) {
            const addressComponents = res.address_components || [];
            streetName = extractAddressComponent(addressComponents, ["street_number", "premise", "point_of_interest"]) || "Unnamed Street";
          }
        }

        // If neighborhood is empty, use a fallback
        if (!neighborhood) {
          neighborhood = district || province || "Unknown area";
        }

        // If district is empty but we have neighborhood, swap them
        if (!district && neighborhood) {
          district = neighborhood;
          neighborhood = '';
        }

        const formattedAddress = {
          title: "Home",
          longitude: lng,
          latitude: lat,
          street: streetName || "Unknown street",
          neighborhood: neighborhood || "Unknown neighborhood",
          district: district || "Unknown district",
          province: province || "Unknown province",
          country: country || "Unknown country",
          postalCode: postalCode || "Unknown postal code",
          apartmentNo: apartmentNo,
          doorNo: doorNo,
          isPrimary: true,
          formattedAddress: result.formatted_address || ""
        };

        console.log("Address extracted:", formattedAddress);
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

    try {
      const resultAction = await dispatch(addAddressAsync(addressPayload)).unwrap();
      setSuccessMessage("Address saved successfully!");
      setShowSuccess(true);

      // Short delay before redirecting to home
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.error("Failed to save address:", error);
    }
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
      })).then(() => {
        setSuccessMessage("Address set as primary!");
        setShowSuccess(true);
      });
    }
  };

  return (
      <div>
        <ScrollToTop/>
        <div className="address-selection-container">
          {showSuccess && (
              <div className="success-toast">
                <i className="bi bi-check-circle-fill"></i>
                <span>{successMessage}</span>
              </div>
          )}

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

        <style>{`
          .address-selection-container {
            background-color: #f8f9fa;
            min-height: 100vh;
            padding-top: 2rem;
            padding-bottom: 3rem;
            position: relative;
          }

          .success-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #50703C;
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            box-shadow: 0 4px 20px rgba(80, 112, 60, 0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            animation: slideDown 0.3s forwards, fadeOut 0.3s 2.7s forwards;
            font-weight: 500;
          }

          .success-toast i {
            font-size: 18px;
          }

          @keyframes slideDown {
            from { transform: translate(-50%, -20px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }

          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }

          .address-title {
            font-size: 28px;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.75rem;
          }

          .address-subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 2rem;
          }

          .address-sidebar {
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            padding: 20px;
            height: 100%;
            max-height: 700px;
            overflow-y: auto;
          }

          .address-sidebar::-webkit-scrollbar {
            width: 6px;
          }

          .address-sidebar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }

          .address-sidebar::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 10px;
          }

          .address-sidebar::-webkit-scrollbar-thumb:hover {
            background: #aaa;
          }

          .sidebar-header {
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
          }

          .sidebar-header h3 {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
          }

          .no-addresses {
            padding: 20px;
            color: #666;
            text-align: center;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px dashed #ddd;
          }

          .no-addresses p {
            margin-bottom: 8px;
          }

          .no-addresses p:last-child {
            font-weight: 500;
            color: #50703C;
          }

          .address-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .address-card {
            background-color: #f8f9fa;
            border-left: 3px solid transparent;
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
          }

          .address-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
            border-left-color: #50703C;
          }

          .address-card.selected {
            background-color: rgba(80, 112, 60, 0.1);
            border-left-color: #50703C;
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
          }

          .address-card-content {
            padding-left: 10px;
          }

          .address-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .address-card-header h4 {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0;
          }

          .primary-badge {
            background-color: #50703C;
            color: white;
            font-size: 12px;
            font-weight: 500;
            padding: 4px 8px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 2px 6px rgba(80, 112, 60, 0.3);
          }

          .primary-badge::before {
            content: '✓';
            display: inline-block;
            font-weight: bold;
          }

          .address-card-body p {
            margin: 5px 0;
            font-size: 14px;
            color: #555;
            line-height: 1.4;
          }

          .address-details {
            margin-top: 10px;
            font-style: italic;
            color: #666;
            background-color: rgba(0,0,0,0.03);
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 13px;
          }

          .map-container {
            position: relative;
            margin-bottom: 20px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .map-instructions {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background-color: white;
            padding: 10px 15px;
            border-radius: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #333;
          }

          .map-instructions i {
            color: #50703C;
            font-size: 16px;
          }

          .my-location-button {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background-color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: none;
            cursor: pointer;
            color: #50703C;
            transition: all 0.3s ease;
          }

          .my-location-button:hover {
            background-color: #50703C;
            color: white;
          }

          .my-location-button:before {
            content: '📍';
            font-size: 18px;
          }

          .address-form {
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            padding: 20px;
          }

          .address-form h3 {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
          }

          .full-address-display {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #50703C;
          }

          .full-address-display p {
            margin: 0;
            color: #333;
            font-size: 15px;
            line-height: 1.5;
          }

          .address-form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #666;
          }

          .form-value {
            font-size: 15px;
            color: #333;
            font-weight: 500;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }

          .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.3s ease;
          }

          .form-control:focus {
            border-color: #50703C;
            box-shadow: 0 0 0 3px rgba(80, 112, 60, 0.2);
            outline: none;
          }

          .form-control::placeholder {
            color: #aaa;
          }

          .save-address-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 30px;
          }

          .save-address-btn {
            background-color: #50703C;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(80, 112, 60, 0.3);
          }

          .save-address-btn:hover:not(:disabled) {
            background-color: #3d5a2c;
            transform: translateY(-2px);
          }

          .save-address-btn:active:not(:disabled) {
            transform: translateY(0);
          }

          .save-address-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .spinner {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .error-alert {
            background-color: #fef1f2;
            border-left: 4px solid #ef4444;
            color: #b91c1c;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .error-alert i {
            font-size: 18px;
            color: #dc2626;
          }

          /* Responsive improvements */
          @media (max-width: 992px) {
            .address-form-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 768px) {
            .address-form-grid {
              grid-template-columns: 1fr;
            }

            .save-address-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
  );
};

export default AddressSelection;

