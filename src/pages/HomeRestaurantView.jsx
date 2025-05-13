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

    return (
        <div>
            <div>
                {loaderStatus ? (
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
                ) : (
                    <>
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
                        <section className="hero-section">
                            <div className="container mt-8">
                                <RestaurantMap />
                                <RecentRestaurants />
                                <FavoriteRestaurantList />
                                <div className="restaurant-section mt-4">
                                    <h2 className="text-dark fw-bold">Nearby Restaurants</h2>
                                    <p className="lead">Find restaurants with surplus food near you</p>
                                    <RestaurantList />
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}

export default HomeRestaurantView;