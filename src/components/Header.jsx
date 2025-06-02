import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@src/redux/thunks/cartThunks";
import { logoutUserThunk, getUserDataThunk } from "@src/redux/thunks/userThunks";
import FreshDealLogo from "../images/FreshDealLogo.png";
import { tokenService } from "@src/services/tokenService.js";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems } = useSelector((state) => state.cart);
    const { token, name_surname, isAuthenticated } = useSelector((state) => state.user);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUserThunk()).unwrap();
            // Force navigation to home page
            navigate('/');
            // Force reload of the page to ensure all state is completely reset
            // This is a fallback in case the Redux state isn't fully cleaned up
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const totalItems = cartItems.reduce((sum, item) => sum + (item.count || 1), 0);

    return (
        <header className="header-container">
            <div className="header-content">
                <Link className="logo-link" to="/">
                    <img src={FreshDealLogo} alt="FreshDeal Logo" className="logo-image" />
                </Link>

                {(token || isAuthenticated) ? (
                    <div className="nav-links">
                        <Link to="/orders" className={`nav-link ${location.pathname.includes('/order') ? 'active' : ''}`}>
                            <i className="bi bi-receipt"></i>
                            <span>Orders</span>
                        </Link>

                        <Link to="/account" className={`nav-link ${location.pathname === '/account' ? 'active' : ''}`}>
                            <i className="bi bi-person"></i>
                            <span>Account</span>
                        </Link>

                        <Link to="/cart" className={`nav-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}>
                            <i className="bi bi-cart"></i>
                            <span>Cart</span>
                            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>

                        <div className="user-profile" ref={dropdownRef}>
                            <div className="user-name" onClick={() => setShowDropdown(!showDropdown)}>
                                <div className="avatar">
                                    {name_surname ? name_surname.substring(0, 2).toUpperCase() : 'U'}
                                </div>
                                <span>{name_surname || 'User'}</span>
                                <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'}`}></i>
                            </div>

                            {showDropdown && (
                                <div className="user-dropdown">
                                    <Link to="/account" className="dropdown-item">
                                        <i className="bi bi-person-circle"></i>
                                        <span>My Profile</span>
                                    </Link>
                                    <Link to="/orders" className="dropdown-item">
                                        <i className="bi bi-receipt"></i>
                                        <span>My Orders</span>
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login" className="login-btn">
                            Login
                        </Link>
                        <Link to="/register" className="register-btn">
                            Register
                        </Link>
                    </div>
                )}
            </div>

            <style jsx>{`
                .header-container {
                    background-color: #FFFFFF;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    padding: 15px 0;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }
                
                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                
                .logo-image {
                    width: 140px;
                    height: auto;
                }
                
                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                
                .nav-link {
                    display: flex;
                    align-items: center;
                    color: #333333;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 15px;
                    padding: 8px 12px;
                    border-radius: 8px;
                    transition: background-color 0.2s, color 0.2s;
                }
                
                .nav-link:hover {
                    background-color: #f8f9fa;
                    color: #50703C;
                }
                
                .nav-link.active {
                    color: #50703C;
                    background-color: rgba(80, 112, 60, 0.1);
                }
                
                .nav-link i {
                    font-size: 18px;
                    margin-right: 6px;
                }
                
                .cart-link {
                    position: relative;
                }
                
                .cart-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background-color: #50703C;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                    min-width: 20px;
                    height: 20px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 5px;
                }
                
                .user-profile {
                    position: relative;
                }
                
                .user-name {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    padding: 8px 12px;
                    border-radius: 8px;
                    transition: background-color 0.2s;
                }
                
                .user-name:hover {
                    background-color: #f8f9fa;
                }
                
                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: #50703C;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: -1px;
                }
                
                .user-dropdown {
                    position: absolute;
                    top: 45px;
                    right: 0;
                    width: 200px;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    padding: 8px 0;
                    z-index: 10;
                    animation: fadeIn 0.2s ease-out;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 16px;
                    color: #333333;
                    text-decoration: none;
                    transition: background-color 0.2s;
                }
                
                .dropdown-item:hover {
                    background-color: #f8f9fa;
                }
                
                .dropdown-item i {
                    font-size: 18px;
                    color: #666666;
                }
                
                .dropdown-divider {
                    height: 1px;
                    background-color: #eeeeee;
                    margin: 8px 0;
                }
                
                .logout-btn {
                    width: 100%;
                    text-align: left;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 15px;
                }
                
                .logout-btn i {
                    color: #DC3545;
                }
                
                .auth-buttons {
                    display: flex;
                    gap: 12px;
                }
                
                .login-btn, .register-btn {
                    padding: 8px 20px;
                    border-radius: 8px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                
                .login-btn {
                    background-color: white;
                    color: #50703C;
                    border: 1px solid #50703C;
                }
                
                .login-btn:hover {
                    background-color: #f8f9fa;
                }
                
                .register-btn {
                    background-color: #50703C;
                    color: white;
                    border: 1px solid #50703C;
                }
                
                .register-btn:hover {
                    background-color: #455f31;
                }
                
                @media (max-width: 768px) {
                    .header-content {
                        padding: 0 15px;
                    }
                    
                    .nav-links {
                        gap: 10px;
                    }
                    
                    .nav-link span {
                        display: none;
                    }
                    
                    .nav-link i {
                        margin-right: 0;
                        font-size: 22px;
                    }
                    
                    .user-name span {
                        display: none;
                    }
                    
                    .user-name i {
                        display: none;
                    }
                }
                
                @media (max-width: 480px) {
                    .logo-image {
                        width: 120px;
                    }
                    
                    .nav-links {
                        gap: 5px;
                    }
                    
                    .nav-link {
                        padding: 8px;
                    }
                    
                    .auth-buttons {
                        gap: 8px;
                    }
                    
                    .login-btn, .register-btn {
                        padding: 6px 12px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;

