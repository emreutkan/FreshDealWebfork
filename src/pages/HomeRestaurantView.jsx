import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddressBar from "../components/AddressBar";
import RestaurantList from "../components/RestaurantList";
import RecentRestaurants from "../components/RecentRestaurants";
import FavoriteRestaurantList from "../components/FavoriteRestaurantList";
import { MagnifyingGlass } from "react-loader-spinner";

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
                        <section className="hero-section">
                            <div className="container mt-8">
                                <AddressBar />
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