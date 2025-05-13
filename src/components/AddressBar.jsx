import React from "react";
import { Link } from "react-router-dom";
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

            <style>{`
                .address-bar {
                    background-color: #fff;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    margin-bottom: 24px;
                    transition: transform 0.3s, box-shadow 0.3s;
                    overflow: hidden;
                }

                .address-bar:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
                }

                .address-bar-content {
                    display: flex;
                    align-items: center;
                    padding: 18px 20px;
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
                    margin-right: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(10, 173, 10, 0.1);
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                }

                .address-details {
                    flex: 1;
                }

                .delivery-text {
                    font-size: 13px;
                    color: #6c757d;
                    margin-bottom: 4px;
                }

                .address-text {
                    font-weight: 600;
                    color: #212529;
                    font-size: 15px;
                    line-height: 1.4;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 85%;
                }

                .address-arrow {
                    color: #6c757d;
                    margin-left: 12px;
                    font-size: 18px;
                    transition: transform 0.2s;
                }

                .address-bar-content:hover .address-arrow {
                    transform: translateX(3px);
                }

                @media (max-width: 576px) {
                    .address-icon {
                        font-size: 20px;
                        width: 40px;
                        height: 40px;
                        margin-right: 12px;
                    }

                    .address-text {
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
}

export default AddressBar;