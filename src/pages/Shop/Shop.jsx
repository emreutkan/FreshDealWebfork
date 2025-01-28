import React, {useContext, useEffect, useReducer, useState} from "react";
import {MagnifyingGlass} from 'react-loader-spinner'
import assortment from "../../images/assortment-citrus-fruits.png";
import {Link} from "react-router";
import '@fortawesome/fontawesome-free/css/all.min.css';
import product1 from "@src/images/category-baby-care.jpg";
import ScrollToTop from "../ScrollToTop";
import axios from "axios";
import AuthContext from "@src/context/AuthContext";

function Dropdown() {
    const {authToken} = useContext(AuthContext);
    const api = axios.create({
        baseURL: 'https://freshdealapi-fkfaajfaffh4c0ex.uksouth-01.azurewebsites.net',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });

    const [openDropdowns, setOpenDropdowns] = useState([]);
    const [loaderStatus, setLoaderStatus] = useState(true);
    const [restaurantList, setRestaurantList] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);
    let userAddresses;

    const getUserData = async () => {
        const response = await api.get('/v1/user')
            .catch(error => console.error(error));

        return response.data;
    }

    const getRestaurants = async (latitude, longitude, radius) => {
        const response = await api.post("/v1/restaurants/proximity", {
            latitude,
            longitude,
            radius,
        }).catch(error => console.error(error))
        //console.log(response.data.restaurants);
        setRestaurantList(response.data.restaurants);
    }

    const toggleDropdown = (index) => {
        if (openDropdowns.includes(index)) {
            setOpenDropdowns(openDropdowns.filter((item) => item !== index));
        } else {
            setOpenDropdowns([...openDropdowns, index]);
        }
    };

    if (restaurantList.length === 0) {
        getUserData().then((response) => {
            userAddresses = response.user_address_list;
            const primaryAddress = userAddresses.find(address => address.is_primary === true);
            getRestaurants(primaryAddress.latitude, primaryAddress.longitude, 5000000);
            setLoaderStatus(false);
        })
    }

    const setFavorite = async (id) => {
        api.post("/v1/user/favorites", {
            restaurant_id: id,
        }).then(() => updateFavorites()).catch(error => console.error(error))
    }
    const removeFavorite = async (id) => {
        api.delete("/v1/user/favorites", { data: {
                restaurant_id: parseInt(id),
            }
        }).then(() => updateFavorites()).catch(error => console.error(error))
    }
    const updateFavorites = async () => {
        api.get("/v1/user/favorites").then((response) => {
            setUserFavorites(response.data.favorites);
        }).catch(error => console.error(error))
    }

    useEffect(() => {
        updateFavorites()
    }, [])

    return (
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
                    <>
                        <ScrollToTop/>
                    </>
                    <div className="container ">
                        <div className="row">
                            <h5 className="mb-3 mt-8">Categories</h5>
                            {/*<div className="col-md-3">
                                {dropdownData.map((dropdown, index) => (
                                    <ul className="nav flex-column" key={index}>
                                        <li className="nav-item">
                                            <Link
                                                className="nav-link"
                                                to="#"
                                                onClick={() => toggleDropdown(index)}
                                                aria-expanded={
                                                    openDropdowns.includes(index) ? "true" : "false"
                                                }
                                                aria-controls={`categoryFlush${index + 1}`}
                                            >
                                                {dropdown.title} <i className="fa fa-chevron-down"  />
                                            </Link>
                                            <div
                                                className={`collapse ${
                                                    openDropdowns.includes(index) ? "show" : ""
                                                }`}
                                                id={`categoryFlush${index + 1}`}
                                            >
                                                <div>
                                                    <ul className="nav flex-column ms-3">
                                                        {dropdown.items.map((item, itemIndex) => (
                                                            <li className="nav-item" key={itemIndex}>
                                                                <Link className="nav-link" to="#">
                                                                    {item}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                ))}
                                <div>
                                    <div className="py-4">
                                        <h5 className="mb-3">Stores</h5>
                                        <div className="my-4">
                                            <input
                                                type="search"
                                                className="form-control"
                                                placeholder="Search by store"
                                            />
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue
                                                id="eGrocery"
                                                defaultChecked
                                            />
                                            <label className="form-check-label" htmlFor="eGrocery">
                                                E-Grocery
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue
                                                id="DealShare"
                                            />
                                            <label className="form-check-label" htmlFor="DealShare">
                                                DealShare
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue
                                                id="Dmart"
                                            />
                                            <label className="form-check-label" htmlFor="Dmart">
                                                DMart
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue
                                                id="Blinkit"
                                            />
                                            <label className="form-check-label" htmlFor="Blinkit">
                                                Blinkit
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue
                                                id="BigBasket"
                                            />
                                            <label className="form-check-label" htmlFor="BigBasket">
                                                BigBasket
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue
                                                id="StoreFront"
                                            />
                                            <label className="form-check-label" htmlFor="StoreFront">
                                                StoreFront
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue
                                                id="Spencers"
                                            />
                                            <label className="form-check-label" htmlFor="Spencers">
                                                Spencers
                                            </label>
                                        </div>
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue
                                                id="onlineGrocery"
                                            />
                                            <label className="form-check-label" htmlFor="onlineGrocery">
                                                Online Grocery
                                            </label>
                                        </div>
                                    </div>
                                    <div className="py-4">
                                        <h5 className="mb-3">Price</h5>
                                        <div>
                                            <div id="priceRange" className="mb-3"/>
                                            <small className="text-muted">Price:</small>{" "}
                                            <span id="priceRange-value" className="small"/>
                                        </div>
                                    </div>
                                    <div className="py-4">
                                        <h5 className="mb-3">Rating</h5>
                                        <div>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    defaultValue
                                                    id="ratingFive"
                                                />
                                                <label className="form-check-label" htmlFor="ratingFive">
                                                    <i className="bi bi-star-fill text-warning"/>
                                                    <i className="bi bi-star-fill text-warning "/>
                                                    <i className="bi bi-star-fill text-warning "/>
                                                    <i className="bi bi-star-fill text-warning "/>
                                                    <i className="bi bi-star-fill text-warning "/>
                                                </label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    defaultValue
                                                    id="ratingFour"
                                                    defaultChecked
                                                />
                                                <label className="form-check-label" htmlFor="ratingFour">
                                                    <i className="bi bi-star-fill text-warning"/>
                                                    <i className="bi bi-star-fill text-warning "/>
                                                    <i className="bi bi-star-fill text-warning "/>
                                                    <i className="bi bi-star-fill text-warning "/>
                                                    <i className="bi bi-star text-warning"/>
                                                </label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    defaultValue
                                                    id="ratingThree"
                                                />
                                                <label className="form-check-label" htmlFor="ratingThree">
                                                    <i className="bi bi-star-fill text-warning"/>
                                                    <i className="bi bi-star-fill text-warning "/>
                                                    <i className="bi bi-star-fill text-warning "/>
                                                    <i className="bi bi-star text-warning"/>
                                                    <i className="bi bi-star text-warning"/>
                                                </label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    defaultValue
                                                    id="ratingTwo"
                                                />
                                                <label className="form-check-label" htmlFor="ratingTwo">
                                                    <i className="bi bi-star-fill text-warning"/>
                                                    <i className="bi bi-star-fill text-warning"/>
                                                    <i className="bi bi-star text-warning"/>
                                                    <i className="bi bi-star text-warning"/>
                                                    <i className="bi bi-star text-warning"/>
                                                </label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    defaultValue
                                                    id="ratingOne"
                                                />
                                                <label className="form-check-label" htmlFor="ratingOne">
                                                    <i className="bi bi-star-fill text-warning"/>
                                                    <i className="bi bi-star text-warning"/>
                                                    <i className="bi bi-star text-warning"/>
                                                    <i className="bi bi-star text-warning"/>
                                                    <i className="bi bi-star text-warning"/>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-4">
                                        <div className="position-absolute p-5 py-8">
                                            <h3 className="mb-0">Fresh Fruits </h3>
                                            <p>Get Upto 25% Off</p>
                                            <Link to="#" className="btn btn-dark">
                                                Shop Now
                                                <i className="feather-icon icon-arrow-right ms-1"/>
                                            </Link>
                                        </div>
                                        <img
                                            src={assortment}
                                            alt="assortment"
                                            className="img-fluid rounded-3"
                                        />
                                    </div>
                                </div>
                            </div>*/}
                            <div className="">
                                <div className="card mb-4 bg-light border-0">
                                    <div className=" card-body p-9">
                                        <h1 className="mb-0">Restaurants</h1>
                                    </div>
                                </div>
                                <div className="d-md-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="mb-3 mb-md-0">
                                            {" "}
                                            <span className="text-dark">24 </span> Restaurants found{" "}
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link to="/ShopListCol" className="text-muted me-3">
                                            <i className="bi bi-list-ul"/>
                                        </Link>
                                        <Link to="/ShopGridCol3" className=" me-3 active">
                                            <i className="bi bi-grid"/>
                                        </Link>
                                        <Link to="/Shop" className="me-3 text-muted">
                                            <i className="bi bi-grid-3x3-gap"/>
                                        </Link>
                                        <div className="me-2">
                                            <select
                                                className="form-select"
                                                aria-label="Default select example"
                                            >
                                                <option selected>Show: 50</option>
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={30}>30</option>
                                            </select>
                                        </div>
                                        <div>
                                            <select
                                                className="form-select"
                                                aria-label="Default select example"
                                            >
                                                <option selected>Sort by: Featured</option>
                                                <option value="Low to High">Price: Low to High</option>
                                                <option value="High to Low"> Price: High to Low</option>
                                                <option value="Release Date"> Release Date</option>
                                                <option value="Avg. Rating"> Avg. Rating</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-4 row-cols-xl-4 row-cols-lg-3 row-cols-2 row-cols-md-2 mt-2">
                                    {restaurantList.map((restaurant, key) => {
                                        return (
                                            <div key={key} className="col">
                                                <div className="card card-product">
                                                    <div className="card-body">
                                                        <div className="text-center position-relative ">
                                                            {/*<div className=" position-absolute top-0 start-0">
                                                                <span className="badge bg-danger">Sale</span>
                                                            </div>*/}
                                                            <Link to="#!">
                                                                <img
                                                                    src={restaurant.image_url}
                                                                    alt={restaurant.restaurantName}
                                                                    className="mb-3 img-fluid"
                                                                />
                                                            </Link>
                                                            <div className="card-product-action">
                                                                {/*<Link
                                                                    to="#!"
                                                                    className="btn-action"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#quickViewModal"
                                                                >
                                                                    <i
                                                                        className="bi bi-eye"
                                                                        data-bs-toggle="tooltip"
                                                                        data-bs-html="true"
                                                                        title="Quick View"
                                                                    />
                                                                </Link>*/}
                                                                <button
                                                                    onClick={() => {
                                                                        userFavorites.includes(restaurant.id) ? removeFavorite(restaurant.id) : setFavorite(restaurant.id)
                                                                    }}
                                                                    className="btn btn-action"
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-html="true"
                                                                    title="Favorite"
                                                                >
                                                                    <i className={userFavorites.includes(restaurant.id) ? "bi bi-heart-fill" : "bi bi-heart"}/>
                                                                </button>
                                                                {/*<Link
                                                                    to="#!"
                                                                    className="btn-action"
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-html="true"
                                                                    title="Compare"
                                                                >
                                                                    <i className="bi bi-arrow-left-right"/>
                                                                </Link>*/}
                                                            </div>
                                                        </div>
                                                        <div className="text-small mb-1">
                                                            <Link to="#!" className="text-decoration-none text-muted">
                                                                <small>{restaurant.category}</small>
                                                            </Link>
                                                        </div>
                                                        <h2 className="fs-6">
                                                            <Link to="#!" className="text-inherit text-decoration-none">
                                                                {restaurant.restaurantName}
                                                            </Link>
                                                        </h2>
                                                        <div>
                                                            <small className="text-warning">
                                                                {" "}
                                                                <i className="bi bi-star-fill"/>
                                                                {/*<i className="bi bi-star-fill"/>
                                                                <i className="bi bi-star-fill"/>
                                                                <i className="bi bi-star-fill"/>
                                                                <i className="bi bi-star-half"/>*/}
                                                            </small>{" "}
                                                            <span className="text-muted small">{restaurant.rating || 0}({restaurant.ratingCount})</span>
                                                        </div>
                                                        <div
                                                            className="d-flex justify-content-between align-self-end align-items-center mt-3">
                                                            <div></div>
                                                            {/*<div>
                                                                <span className="text-dark">$18</span>{" "}
                                                                <span
                                                                    className="text-decoration-line-through text-muted">
                                                            $24
                                                        </span>
                                                            </div>*/}
                                                            <div>
                                                                <Link to="#!" className="btn btn-primary btn-sm">
                                                                    {/*<svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width={16}
                                                                        height={16}
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="feather feather-plus"
                                                                    >
                                                                        <line x1={12} y1={5} x2={12} y2={19}/>
                                                                        <line x1={5} y1={12} x2={19} y2={12}/>
                                                                    </svg>*/}&gt;
                                                                    {" "}
                                                                    View
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="row mt-8">
                                    <div className="col">
                                        <nav>
                                            <ul className="pagination">
                                                <li className="page-item disabled">
                                                    <Link
                                                        className="page-link  mx-1 rounded-3 "
                                                        to="#"
                                                        aria-label="Previous"
                                                    >
                                                        <i className="fa fa-chevron-left"/>
                                                    </Link>
                                                </li>
                                                <li className="page-item ">
                                                    <Link className="page-link  mx-1 rounded-3 active" to="#">
                                                        1
                                                    </Link>
                                                </li>
                                                <li className="page-item">
                                                    <Link className="page-link mx-1 rounded-3 text-body" to="#">
                                                        2
                                                    </Link>
                                                </li>
                                                <li className="page-item">
                                                    <Link className="page-link mx-1 rounded-3 text-body" to="#">
                                                        ...
                                                    </Link>
                                                </li>
                                                <li className="page-item">
                                                    <Link className="page-link mx-1 rounded-3 text-body" to="#">
                                                        12
                                                    </Link>
                                                </li>
                                                <li className="page-item">
                                                    <Link
                                                        className="page-link mx-1 rounded-3 text-body"
                                                        to="#"
                                                        aria-label="Next"
                                                    >
                                                        <i className="fa fa-chevron-right"/>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

const dropdownData = [
    {
        title: "Dairy, Bread & Eggs",
        items: [
            "Milk",
            "Milk Drinks",
            "Curd & Yogurt",
            "Eggs",
            "Bread",
            "Buns & Bakery",
            "Butter & More",
            "Cheese",
            "Paneer & Tofu",
            "Cream & Whitener",
            "Condensed Milk",
            "Vegan Drinks",
        ],
    },
    {
        title: "Snacks & Munchies",
        items: [
            "Chips & Crisps",
            "Nachos",
            "Popcorn",
            "Bhujia & Mixtures",
            "Namkeen Snacks",
            "Healthy Snacks",
            "Cakes & Rolls",
            "Energy Bars",
            "Papad & Fryums",
            "Rusks & Wafers",
        ],
    },
    {
        title: "Fruits & Vegetables",
        items: [
            "Fresh Vegetables",
            "Herbs & Seasonings",
            "Fresh Fruits",
            "Organic Fruits & Vegetables",
            "Cuts & Sprouts",
            "Exotic Fruits & Veggies",
            "Flower Bouquets, Bunches",
        ],
    },
    {
        title: "Cold Drinks & Juices",
        items: [
            "Soft Drinks",
            "Fruit Juices",
            "Coldpress",
            "Energy Drinks",
            "Water & Ice Cubes",
            "Soda & Mixers",
            "Concentrates & Syrups",
            "Detox & Energy Drinks",
            "Juice Collection",
        ],
    },
];

export default Dropdown;