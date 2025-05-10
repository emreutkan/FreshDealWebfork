import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import AuthContext from '@src/context/AuthContext.jsx';
import CartContext from "@src/context/CartContext";
import GlobalResetContext from "@src/context/GlobalResetContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeItemFromCart } from "@src/redux/thunks/cartThunks";

const ShopCart = () => {
    const dispatch = useDispatch();
    const { cartRestaurantId, setCartRestaurantId, addToCart, removeFromCart } = useContext(CartContext);
    const { globalReset } = useContext(GlobalResetContext);
    const { authToken } = useContext(AuthContext);

    const cartItems = useSelector((state) => state.cart.cartItems);
    const loading = useSelector((state) => state.cart.loading);

    // loading
    const [loaderStatus, setLoaderStatus] = useState(true);

    useEffect(() => {
        dispatch(fetchCart());
        setLoaderStatus(false);
    }, [dispatch, globalReset]);

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
                        <>
                            <ScrollToTop />
                        </>
                        <>
                            <div>
                                <section className="mb-lg-14 mb-8 mt-8">
                                    <div className="container">
                                        {/* row */}
                                        <div className="row">
                                            <div className="col-12">
                                                {/* card */}
                                                <div className="card py-1 border-0 mb-8">
                                                    <div>
                                                        <h1 className="fw-bold">Shop Cart</h1>
                                                        <p className="mb-0">Shopping in 382480</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* row */}
                                        <div className="row">
                                            <div className="col-lg-8 col-md-7">
                                                <div className="py-3">
                                                    {/* alert */}
                                                    <div className="alert alert-danger p-2" role="alert">
                                                        You've got FREE delivery. Start{" "}
                                                        <Link to
                                                                  ="#!" className="alert-link">
                                                            checkout now!
                                                        </Link>
                                                    </div>
                                                    {cartItems.length === 0 ? (
                                                        <p>Your Cart is Empty.</p>
                                                    ) : (
                                                        <ul className="list-group list-group-flush">
                                                            {cartItems.map((item, index) => {
                                                                const isFirst = index === 0;
                                                                const isLast = index === cartItems.length - 1;
                                                                return (
                                                                    <li
                                                                        className={`list-group-item py-3 ps-0 border-top ${
                                                                            isFirst ? "border-top-0" : ""
                                                                        } ${isLast ? "border-bottom" : ""}`}
                                                                        key={index}
                                                                    >
                                                                        {/* row */}
                                                                        <div className="row align-items-center">
                                                                            <div className="col-3 col-md-2">
                                                                                {/* img */}
                                                                                <img
                                                                                    src={item.image_url}
                                                                                    alt="Ecommerce"
                                                                                    className="img-fluid"
                                                                                />
                                                                            </div>
                                                                            <div className="col-4 col-md-5">
                                                                                {/* title */}
                                                                                <Link to={"#!"} className="text-inherit">
                                                                                    <h6 className="mb-0">{item.name}</h6>
                                                                                </Link>
                                                                                <span>
                                          <small className="text-muted">
                                            {item.quantity}
                                          </small>
                                        </span>
                                                                                <div className="mt-2 small lh-1">
                                                                                    <a
                                                                                        href="#!"
                                                                                        className="text-decoration-none text-inherit"
                                                                                        onClick={() => dispatch(removeItemFromCart({ id: item.id }))}
                                                                                    >
                                            <span className="me-1 align-text-bottom">
                                              <i className="fas fa-trash-alt"></i>
                                            </span>
                                                                                        <span className="text-muted">
                                              Remove
                                            </span>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                            {/* input group */}
                                                                            <div className="col-3 col-md-3 col-lg-2">
                                                                                <div className="input-group input-spinner">
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form-control"
                                                                                        value={item.quantity}
                                                                                        disabled
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            {/* price */}
                                                                            <div className="col-2 text-lg-end text-start text-md-end col-md-2">
                                        <span className="fw-bold">
                                          ${item.price}
                                        </span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShopCart;