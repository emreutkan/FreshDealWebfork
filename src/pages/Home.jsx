import slider1 from "../images/slide-1.jpg";
import abouticon from "../images/about-icons-1.svg";
import slider2 from "../images/slider-2.jpg";
import map from "../images/map.png";
import iphone from "../images/iphone-2.png";
import googleplay from "../images/googleplay-btn.svg";
import appstore from "../images/appstore-btn.svg";

import { Link } from "react-router";
import  { useState, useEffect } from "react";
import { Slide } from "react-awesome-reveal";
import { MagnifyingGlass } from "react-loader-spinner";
import { useSelector } from "react-redux";
import HomeRestaurantView from "./HomeRestaurantView";

function Home() {
    // Always define all the hooks at the top
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const token = useSelector((state) => state.user.token);
    const [isVisible, setIsVisible] = useState(false);
    const [loaderStatus, setLoaderStatus] = useState(true);

    // Always call useEffect at the top level, don't conditionally call it
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoaderStatus(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    if (isAuthenticated && token) {
        return <HomeRestaurantView />;
    }

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
        <div>
            <div className="scroll-to-top">
                <button
                    onClick={scrollToTop}
                    className={`scroll-to-top-button ${isVisible ? "show" : ""}`}
                >
                    ↑
                </button>
            </div>

            {/* Hero Section with Carousel */}
            <section className="hero-section">
                <div className="container mt-8">
                    <div
                        id="carouselExampleFade"
                        className="carousel slide carousel-fade"
                        data-bs-ride="carousel"
                    >
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div
                                    style={{
                                        background: `url(${slider1}) no-repeat`,
                                        backgroundSize: "cover",
                                        borderRadius: ".5rem",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <div className="ps-lg-12 py-lg-16 col-xxl-5 col-md-7 py-14 px-8 text-xs-center">
                                        <h2 className="text-dark display-5 fw-bold mt-4">
                                            Fresh Deal
                                        </h2>
                                        <p className="lead">
                                            we are a food waste app that connects users with local businesses
                                            to buy surplus food at discounted prices.
                                        </p>
                                        <Link to="#!" className="btn btn-dark mt-3">
                                            Shop Now{" "}
                                            <i className="feather-icon icon-arrow-right ms-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div
                                    style={{
                                        background: `url(${slider2}) no-repeat`,
                                        backgroundSize: "cover",
                                        borderRadius: ".5rem",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <div className="ps-lg-12 py-lg-16 col-xxl-5 col-md-7 py-14 px-8 text-xs-center">
                                        <h2 className="text-dark display-5 fw-bold mt-4">
                                            Order Here
                                        </h2>
                                        <p className="lead">
                                            We want to make it easy for you to find the best deals on FreshDeal
                                        </p>
                                        <Link to="#!" className="btn btn-dark mt-3">
                                            Shop Now{" "}
                                            <i className="feather-icon icon-arrow-right ms-1"/>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link
                            className="carousel-control-prev"
                            to="#carouselExampleFade"
                            role="button"
                            data-bs-slide="prev"
                        >
                            <span
                                className="carousel-control-prev-icon"
                                aria-hidden="true"
                            />
                            <span className="visually-hidden">Previous</span>
                        </Link>
                        <Link
                            className="carousel-control-next"
                            to="#carouselExampleFade"
                            role="button"
                            data-bs-slide="next"
                        >
                            <span
                                className="carousel-control-next-icon"
                                aria-hidden="true"
                            />
                            <span className="visually-hidden">Next</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="mt-8">
                <div className="container">
                    <div className="row">
                        <Slide direction="down">
                            <div className="col-12">
                                <div className="bg-light d-lg-flex justify-content-between align-items-center py-6 py-lg-3 px-8 rounded-3 text-center text-lg-start">
                                    <div className="d-lg-flex align-items-center">
                                        <img
                                            src={abouticon}
                                            alt="about-icon"
                                            className="img-fluid"
                                        />
                                        <div className="ms-lg-4">
                                            <h1 className="fs-2 mb-1">
                                                Welcome to FreshDeal
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="mt-3 mt-lg-0">
                                        <Link to="#" className="btn btn-dark">
                                            Download FreshDeal App
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Slide>
                    </div>
                </div>
            </section>

            {/* App Download Section */}
            <section>
                <div
                    className="container"
                    style={{
                        background: `url(${map})no-repeat`,
                        backgroundSize: "cover",
                    }}
                >
                    <div className="row align-items-center text-center justify-content-center">
                        <div className="col-lg-6 col-md-6 fade-in-left">
                            <Slide direction="left">
                                <div className="mb-6">
                                    <div className="mb-7">
                                        <h1>Get the FreshDeal app</h1>
                                        <h5 className="mb-0"></h5>
                                    </div>
                                    <div>
                                        <ul className="list-inline mb-0 mt-2">
                                            <li className="list-inline-item">
                                                <Link to="#!">
                                                    <img
                                                        src={appstore}
                                                        alt="App Store"
                                                        style={{width: 140}}
                                                    />
                                                </Link>
                                            </li>
                                            <li className="list-inline-item">
                                                <Link to="#!">
                                                    <img
                                                        src={googleplay}
                                                        alt="Google Play"
                                                        style={{width: 140}}
                                                    />
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Slide>
                        </div>
                        <div className="offset-lg-2 col-lg-4 col-md-6 fade-zoom">
                            <Slide direction="right">
                                <div className="text-lg-start">
                                    <img
                                        src={iphone}
                                        alt="iPhone App"
                                        className="img-fluid"
                                    />
                                </div>
                            </Slide>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;