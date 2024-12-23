import axios from "axios";
import React, { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

function Response({ loginData }) {
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
        return component ? component.long_name : null;
    };

    const saveAddress = async () => {
        const response = await axios.post("https://freshdealapi-fkfaajfaffh4c0ex.uksouth-01.azurewebsites.net/v1/add_customer_address",
            addressData
            , {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${loginData.token}`,
                }
            })
        console.log(response.data);

        return response.data;
    }

    return (
        <div>
            <h1 style={{ color: 'white' }}>SELECT ADDRESS</h1>
            <APIProvider apiKey={apiKey}>
                <Map
                    style={mapContainerStyle}
                    defaultZoom={6}
                    defaultCenter={ coordinates }
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    onClick={handleClick}
                >
                    <Marker position={ coordinates }/>
                    </Map>
            </APIProvider>
            <div style={{ marginTop: "20px" }}>
                {coordinates ? (
                    <div>
                        <div style={{ marginTop: "10px" }}>
                            <label>
                                Apartment No:
                                <input
                                    name="apartmentNo"
                                    type="text"
                                    value={apartmentNo}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setApartmentNo(value)
                                        setAddressData({
                                            ...addressData,
                                            [name]: value,
                                        });
                                    }}
                                    style={{ marginLeft: "10px" }}
                                />
                            </label>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <label>
                                Door No:
                                <input
                                    name="doorNo"
                                    type="text"
                                    value={doorNo}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setDoorNo(value)
                                        setAddressData({
                                            ...addressData,
                                            [name]: value,
                                        });
                                    }}
                                    style={{ marginLeft: "10px" }}
                                />
                            </label>
                        </div>
                        <button onClick={saveAddress} style={{
                            padding: "10px 20px",
                            backgroundColor: "#007BFF",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}>
                            Submit Address
                        </button>
                    </div>
                ) : (
                    <p>Select Your Address</p>
                )}
                {addressData && (
                    <pre style={{ color: 'white' }}>{JSON.stringify(addressData, null, 2)}</pre>
                )}
            </div>
        </div>
    );
}

export default Response;