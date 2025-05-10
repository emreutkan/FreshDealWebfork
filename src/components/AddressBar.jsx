import React from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";

function AddressBar() {
    const addresses = useSelector((state) => state.address.addresses);
    const selectedAddressId = useSelector((state) => state.address.selectedAddressId);

    // Find the selected or primary address to display
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId) ||
        addresses.find(addr => addr.is_primary) ||
        (addresses.length > 0 ? addresses[0] : null);

    return (
        <div className="address-bar">
            <Link to="/Address" className="address-bar-content">
                <div className="address-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div className="address-details">
                    <div className="delivery-text">Delivery to</div>
                    {selectedAddress ? (
                        <div className="address-text">
                            {selectedAddress.street}, {selectedAddress.neighborhood}, {selectedAddress.district}
                        </div>
                    ) : (
                        <div className="address-text">Add your delivery address</div>
                    )}
                </div>
                <div className="address-arrow">
                    <i className="bi bi-chevron-right"></i>
                </div>
            </Link>

            <style jsx>{`
                .address-bar {
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    margin-bottom: 24px;
                }

                .address-bar-content {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    text-decoration: none;
                    color: inherit;
                    transition: background-color 0.2s;
                }

                .address-bar-content:hover {
                    background-color: #f8f9fa;
                }

                .address-icon {
                    font-size: 24px;
                    color: #0aad0a;
                    margin-right: 12px;
                }

                .address-details {
                    flex: 1;
                }

                .delivery-text {
                    font-size: 12px;
                    color: #6c757d;
                }

                .address-text {
                    font-weight: 500;
                    color: #212529;
                }

                .address-arrow {
                    color: #6c757d;
                }
            `}</style>
        </div>
    );
}

export default AddressBar;