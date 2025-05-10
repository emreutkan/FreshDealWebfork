// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import ScrollToTop from "../ScrollToTop";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useDispatch, useSelector } from "react-redux";
import {addAddressAsync} from "@src/redux/thunks/addressThunks";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const MyAccountAddress = () => {
  // Redux
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.address.addresses);
  const addressLoading = useSelector((state) => state.address.loading);

  // loading
  const [, setLoaderStatus] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const [coordinates, setCoordinates] = useState({ lat: 39.92077, lng: 32.85411 });
  const [addressData, setAddressData] = useState(null);
  const [apartmentNo, setApartmentNo] = useState(null);
  const [doorNo, setDoorNo] = useState(null);
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

      if (data.status === "OK") {
        const addressComponents = data.results[0]?.address_components || [];
        const formattedAddress = {
          title: "Home",
          longitude: lng,
          latitude: lat,
          street: extractComponent(addressComponents, "route"),
          neighborhood: extractComponent(addressComponents, "neighborhood"),
          district: extractComponent(addressComponents, "sublocality"),
          province: extractComponent(addressComponents, "administrative_area_level_1"),
          country: extractComponent(addressComponents, "country"),
          postalCode: extractComponent(addressComponents, "postal_code"),
          apartmentNo: null,
          doorNo: null,
          isPrimary: true,
        };
        setAddressData(formattedAddress);
      } else {
        setAddressData({ error: "Adres alınamadı. Hata: " + data.status });
      }
    } catch (error) {
      setAddressData({ error: "Bir hata oluştu: " + error.message });
    }
  };

  const extractComponent = (components, type) => {
    const component = components.find((comp) => comp.types.includes(type));
    return component ? component.long_name : 'test';
  };

  const saveAddress = async () => {
    dispatch(addAddressAsync(addressData));
  }

  return (
      <div>
        <>
          <ScrollToTop/>
        </>
        <>
          <div>
            {/* section */}
            <section>
              {/* container */}
              <div className="container">
                {/* row */}
                <div className="row">
                  {/* col */}
                  <div className="col-12">
                    {/* Address Map */}
                    <APIProvider apiKey={apiKey}>
                      <Map
                          center={coordinates}
                          zoom={13}
                          mapId={"YOUR_MAP_ID"}
                          onClick={handleClick}
                          style={mapContainerStyle}
                      >
                        <Marker position={coordinates} />
                      </Map>
                    </APIProvider>
                    {addressData && !addressData.error && (
                        <div className="mt-3">
                          <p>
                            <strong>Street:</strong> {addressData.street}
                          </p>
                          <p>
                            <strong>Neighborhood:</strong> {addressData.neighborhood}
                          </p>
                          <p>
                            <strong>District:</strong> {addressData.district}
                          </p>
                          <p>
                            <strong>Province:</strong> {addressData.province}
                          </p>
                          <p>
                            <strong>Country:</strong> {addressData.country}
                          </p>
                          <p>
                            <strong>Postal Code:</strong> {addressData.postalCode}
                          </p>
                          <div className="form-group mb-3">
                            <label>Apartment No (Optional):</label>
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
                            />
                          </div>

                          <div className="form-group mb-3">
                            <label>Door No (Optional):</label>
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
                            />
                          </div>

                          <button
                              className="btn btn-primary"
                              onClick={saveAddress}
                              disabled={addressLoading}
                          >
                            {addressLoading ? "Saving..." : "Save Address"}
                          </button>
                        </div>
                    )}
                    {addressData && addressData.error && (
                        <div className="alert alert-danger mt-3">
                          {addressData.error}
                        </div>
                    )}

                    {/* Display existing addresses from Redux store */}
                    {addresses.length > 0 && (
                        <div className="mt-5">
                          <h3>Your Addresses</h3>
                          <div className="row">
                            {addresses.map((address) => (
                                <div className="col-md-6" key={address.id}>
                                  <div className="card mb-3">
                                    <div className="card-body">
                                      <h5 className="card-title">{address.title} {address.is_primary && <span className="badge bg-success">Primary</span>}</h5>
                                      <p>{address.street}, {address.neighborhood}</p>
                                      <p>{address.district}, {address.province}, {address.country}</p>
                                      <p>Postal Code: {address.postalCode}</p>
                                      {address.apartmentNo && <p>Apartment No: {address.apartmentNo}</p>}
                                      {address.doorNo && <p>Door No: {address.doorNo}</p>}
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      </div>
  );
};

export default MyAccountAddress;