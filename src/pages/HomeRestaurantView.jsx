import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddressBar from "../components/AddressBar";
import RestaurantList from "../components/RestaurantList";
import RecentRestaurants from "../components/RecentRestaurants";
import FavoriteRestaurantList from "../components/FavoriteRestaurantList";
import { MagnifyingGlass } from "react-loader-spinner";
import RestaurantMap from "../components/RestaurantMap";
import { getRestaurantsByProximity } from "../redux/thunks/restaurantThunks";
import { SearchforRestaurantsThunk } from "../redux/thunks/searchThunks";
import debounce from 'lodash/debounce';
import Recommendations from "@src/components/Recommendations.jsx";
import FlashDealsModal from "@src/components/FlashDealsModal.jsx";
import FlashDealsFloatingBadge from "@src/components/FlashDealsFloatingBadge.jsx";
import { useRestaurantFilter } from "@src/context/RestaurantFilterContext"; // Import the context hook
// Removed CategoryFilter import as it's now handled in RestaurantList component

function HomeRestaurantView() {
    // Existing states for component
    const [loaderStatus, setLoaderStatus] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [, setRefreshing] = useState(false);
    // New states for new features
    const [showFlashDeals, setShowFlashDeals] = useState(false);
    // Removed selectedCategory state as it's now handled in RestaurantList

    const searchInputRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showClosedRestaurants, toggleShowClosedRestaurants } = useRestaurantFilter(); // Use the global state and toggle

    // Show Flash Deals modal automatically when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFlashDeals(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Existing selectors
    const searchResults = useSelector((state) =>
        state.search.searchResults?.results ?? []
    );
    const restaurants = useSelector((state) =>
        state.restaurant.restaurantsProximity ?? []
    );

    // Updated filtered restaurants logic to remove category filtering from this component
    const filteredRestaurants = searchText === ""
        ? restaurants
        : restaurants.filter((restaurant) => searchResults.map(result => result.id).includes(Number(restaurant?.id)));

    // Existing debounced search function
    const debouncedSearch = useCallback(
        debounce((text) => {
            if (text) {
                setIsSearching(true);
                dispatch(SearchforRestaurantsThunk({
                    type: 'restaurant',
                    query: text,
                })).finally(() => setIsSearching(false));
            }
        }, 500),
        []
    );

    // Existing handlers
    const handleSearch = (e) => {
        const text = e.target.value;
        setSearchText(text);
        debouncedSearch(text);

        if (text && !recentSearches.includes(text)) {
            setRecentSearches(prev => [text, ...prev].slice(0, 5));
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchText && filteredRestaurants.length > 0) {
            navigate(`/restaurant/${filteredRestaurants[0].id}`);
        }
    };
    useCallback(() => {
        setRefreshing(true);
        dispatch(getRestaurantsByProximity())
            .finally(() => setRefreshing(false));
    }, []);
    const handleClearSearch = () => {
        setSearchText("");
        searchInputRef.current?.focus();
    };

    const handleRecentSearchClick = (term) => {
        setSearchText(term);
        debouncedSearch(term);
    };

    // Existing useEffect hooks
    useEffect(() => {
        dispatch(getRestaurantsByProximity());
    }, []);

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

                            <div className="mt-4 position-relative">
                                <div className="search-container">
                                    <form onSubmit={handleSearchSubmit}>
                                        <div className="search-input-container">
                                            <i className="bi bi-search search-icon"></i>
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                className="search-input"
                                                placeholder="Search for restaurants..."
                                                value={searchText}
                                                onChange={handleSearch}
                                                onFocus={() => setIsSearchFocused(true)}
                                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                            />
                                            {searchText.length > 0 && (
                                                <button type="button" className="clear-button" onClick={handleClearSearch}>
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                            )}
                                        </div>
                                    </form>

                                    {isSearchFocused && (
                                        <div className="search-results-container">
                                            {isSearching ? (
                                                <div className="search-loading">
                                                    <div className="spinner-border spinner-border-sm text-success" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <span className="ms-2">Searching...</span>
                                                </div>
                                            ) : (
                                                <div className="search-results">
                                                    {searchText.length > 0 ? (
                                                        <>
                                                            <div className="results-header">
                                                                <span className="results-count">{filteredRestaurants.length} results found</span>
                                                            </div>

                                                            <div className="results-list">
                                                                {filteredRestaurants.length > 0 ? (
                                                                    filteredRestaurants.slice(0, 5).map(restaurant => (
                                                                        <div
                                                                            key={restaurant.id}
                                                                            className="result-item"
                                                                            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                                                                        >
                                                                            <div className="result-image">
                                                                                {restaurant.image_url ? (
                                                                                    <img src={restaurant.image_url} alt={restaurant.restaurantName} />
                                                                                ) : (
                                                                                    <div className="no-image">
                                                                                        <i className="bi bi-shop"></i>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            <div className="result-info">
                                                                                <h5 className="result-title">{restaurant.restaurantName}</h5>
                                                                                <div className="result-meta">
                                                                                    <span className="result-distance">
                                                                                        <i className="bi bi-geo-alt me-1"></i>
                                                                                        {restaurant.distance_km ? `${restaurant.distance_km.toFixed(1)} km` : 'Distance unavailable'}
                                                                                    </span>
                                                                                    <span className="result-rating">
                                                                                        <i className="bi bi-star-fill me-1 text-warning"></i>
                                                                                        {restaurant.rating ? restaurant.rating.toFixed(1) : 'New'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            <i className="bi bi-chevron-right result-arrow"></i>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="no-results">
                                                                        <p>No restaurants found matching </p>
                                                                    </div>
                                                                )}

                                                                {filteredRestaurants.length > 5 && (
                                                                    <button
                                                                        className="view-all-btn"
                                                                        onClick={() => navigate('/search', { state: { query: searchText } })}
                                                                    >
                                                                        View all {filteredRestaurants.length} results
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="recent-searches">
                                                            {recentSearches.length > 0 ? (
                                                                <>
                                                                    <h6 className="recent-title">Recent Searches</h6>
                                                                    <div className="recent-list">
                                                                        {recentSearches.map((term, index) => (
                                                                            <div
                                                                                key={index}
                                                                                className="recent-item"
                                                                                onClick={() => handleRecentSearchClick(term)}
                                                                            >
                                                                                <i className="bi bi-clock-history me-2"></i>
                                                                                <span>{term}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <p className="empty-recent">Start typing to search restaurants</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <AddressBar />
                                    {/* Add the toggle switch here */}
                                    <div className="restaurant-filter-toggle-container mt-3 d-flex align-items-center">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="showClosedGlobalToggleHomeView"
                                                checked={showClosedRestaurants}
                                                onChange={toggleShowClosedRestaurants}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                        <label
                                            className="ms-2 user-select-none"
                                            htmlFor="showClosedGlobalToggleHomeView"
                                            style={{ cursor: 'pointer', marginBottom: '0', color: 'white', fontSize: '14px', paddingLeft: "8px" }}
                                        >
                                            {showClosedRestaurants ? " Show closed restaurants" : " Show closed restaurants"}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section py-4">
                <div className="container">
                    {/* New Recommendations Component */}
                    <Recommendations />

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
                        {/* Pass the filtered restaurants to the RestaurantList component */}
                        <RestaurantList filteredRestaurants={filteredRestaurants} />
                    </div>
                </div>
            </section>

            {/* Add Flash Deals Modal */}
            <FlashDealsModal
                show={showFlashDeals}
                onHide={() => setShowFlashDeals(false)}
            />

            {/* Add Floating Badge to reopen Flash Deals */}
            {!showFlashDeals && (
                <FlashDealsFloatingBadge onClick={() => setShowFlashDeals(true)} />
            )}

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

                /* Search Styles */
                .search-container {
                    position: relative;
                    width: 100%;
                    z-index: 1000;
                }

                .search-input-container {
                    display: flex;
                    align-items: center;
                    background-color: white;
                    border-radius: 25px;
                    padding: 0 15px;
                    height: 50px;
                    border: 1px solid #e0e0e0;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .search-icon {
                    color: #666;
                    font-size: 18px;
                    margin-right: 10px;
                }

                .search-input {
                    flex: 1;
                    height: 46px;
                    border: none;
                    outline: none;
                    font-size: 16px;
                    color: #333;
                }

                .clear-button {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    padding: 5px;
                }

                .search-results-container {
                    position: absolute;
                    top: 60px;
                    left: 0;
                    right: 0;
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    max-height: 400px;
                    overflow-y: auto;
                    z-index: 1000;
                }

                .search-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 15px;
                    color: #555;
                }

                .results-header {
                    padding: 12px 15px;
                    border-bottom: 1px solid #f0f0f0;
                }

                .results-count {
                    color: #666;
                    font-size: 14px;
                }

                .result-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 15px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background-color 0.2s;
                }

                .result-item:hover {
                    background-color: #f8f9fa;
                }

                .result-image {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-right: 15px;
                    background-color: #f0f0f0;
                }

                .result-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .no-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                    font-size: 24px;
                }

                .result-info {
                    flex: 1;
                }

                .result-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 5px;
                }

                .result-meta {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .result-distance, .result-rating {
                    font-size: 13px;
                    color: #666;
                }

                .result-arrow {
                    color: #50703C;
                    font-size: 18px;
                }

                .no-results {
                    padding: 20px;
                    text-align: center;
                    color: #666;
                }

                .view-all-btn {
                    display: block;
                    width: 100%;
                    padding: 12px;
                    text-align: center;
                    background-color: #f8f9fa;
                    border: none;
                    color: #50703C;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .view-all-btn:hover {
                    background-color: #e9ecef;
                }

                .recent-searches {
                    padding: 15px;
                }

                .recent-title {
                    color: #333;
                    margin-bottom: 10px;
                    font-weight: 600;
                }

                .recent-item {
                    padding: 10px;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: background-color 0.2s;
                    color: #555;
                }

                .recent-item:hover {
                    background-color: #f0f0f0;
                }

                .empty-recent {
                    text-align: center;
                    color: #999;
                    padding: 15px 0;
                }

                .restaurant-filter-toggle-container label {
                    color: #333; /* Default color for toggle label when not in hero */
                }

                /* Ensure toggle is visible in hero section */
                .hero-section .restaurant-filter-toggle-container label {
                    color: white !important; 
                }

                @media (max-width: 768px) {
                    .hero-section {
                        min-height: 50vh !important;
                    }

                    .search-results-container {
                        max-height: 300px;
                    }
                }
            `}</style>
        </div>
    );
}

export default HomeRestaurantView;

