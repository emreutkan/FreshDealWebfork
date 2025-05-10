import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@src/redux/thunks/cartThunks";
import { logoutUserThunk, getUserDataThunk } from "@src/redux/thunks/userThunks";
import FreshDealLogo from "../images/FreshDealLogo.png";
import { tokenService } from "@src/services/tokenService.js";

const Header = () => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const { token, name_surname, isAuthenticated } = useSelector((state) => state.user);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const initializeUser = async () => {
            const storedToken = await tokenService.getToken();
            if (storedToken) {
                dispatch(getUserDataThunk({ token: storedToken }));
                dispatch(fetchCart());
            }
            setIsLoaded(true);
        };

        initializeUser();
        console.log("Header - Auth Token:", token);
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            dispatch(fetchCart());
        }
    }, [token, dispatch]);

    const handleLogout = () => {
        dispatch(logoutUserThunk());
    };

    return (
        <header className="d-flex justify-content-between align-items-center p-3 bg-light">
            <Link className="logo-link" to="/">
                <img src={FreshDealLogo} style={{ width: 120 }} alt="FreshDeal Logo" />
            </Link>
            <div className="header-actions d-flex align-items-center">
                {(token || isAuthenticated) ? (
                    <>
                        <div className="me-3 text-dark">
                            <span>Welcome, {name_surname || 'User'}</span>
                        </div>
                        <div className="me-3">
                            <Link
                                className="text-muted position-relative"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasCart"
                                role="button"
                                aria-controls="offcanvasCart"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-shopping-bag"
                                >
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1={3} y1={6} x2={21} y2={6} />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
                            </Link>
                        </div>
                        <button
                            className="btn btn-outline-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="btn btn-primary"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;