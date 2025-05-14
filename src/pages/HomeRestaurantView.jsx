import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddressBar from "../components/AddressBar";
import RestaurantList from "../components/RestaurantList";
import RecentRestaurants from "../components/RecentRestaurants";
import FavoriteRestaurantList from "../components/FavoriteRestaurantList";
import { MagnifyingGlass } from "react-loader-spinner";
import RestaurantMap from "../components/RestaurantMap";

function HomeRestaurantView() {
    // States for component
    const [loaderStatus, setLoaderStatus] = useState(true);

    // Loading effect
    useEffect(() => {
        setTimeout(() => {
            setLoaderStatus(false);
        }, 1500);
    }, []);

    if (loaderStatus) {
        return (
            <div className="loader-container">
                <MagnifyingGlass
                    visible={true}
                    height="100"
                    width="100"
                    ariaLabel="magnifying-glass-loading"
                    wrapperStyle={{}}
                    wrapperclassName="magnifying-glass-wrapper"
                    glassColor="#c0efff"
                    color="#0aad0a"
                />
            </div>
        );
    }

    return (
        <div className="home-view">
            <section className="hero-section text-white py-5" style={{
                background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "60vh",
                display: "flex",
                alignItems: "center"
            }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-lg-6">
                            <h1 className="fw-bold mb-4" style={{ fontSize: "2.5rem", color: "white" }}>Reduce Food Waste, Save Money</h1>
                            <p className="lead fs-4 mb-4">Connect with local restaurants offering surplus food at discounted prices</p>
                            <div className="mt-4">
                                <AddressBar />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section py-4">
                <div className="container">
                    <div className="map-container mb-4">
                        <RestaurantMap />
                    </div>

                    <div className="recent-restaurants-container mb-4">
                        <RecentRestaurants />
                    </div>

                    <div className="favorites-container mb-4">
                        <FavoriteRestaurantList />
                    </div>

                    <div className="nearby-restaurants-container mt-4">
                        <div className="section-header mb-3">
                            <h2 className="text-dark fw-bold mb-2">Nearby Restaurants</h2>
                            <p className="lead mb-4">Find restaurants with surplus food near you</p>
                        </div>
                        <RestaurantList />
                    </div>
                </div>
            </section>

            <style jsx>{`
                .home-view {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                .loader-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #ffffff;
                }
                
                .content-section {
                    background-color: #f8f9fa;
                }
                
                .map-container, 
                .recent-restaurants-container, 
                .favorites-container, 
                .nearby-restaurants-container {
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .section-header {
                    position: relative;
                }
                
                @media (max-width: 768px) {
                    .hero-section {
                        min-height: 50vh !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default HomeRestaurantView;