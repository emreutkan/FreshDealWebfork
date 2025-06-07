import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import FreshDealLogo from "../images/FreshDealLogo.png";

function Footer() {
    let date = new Date();
    let year = date.getFullYear();

    return (
        <footer className="footer">
            <div className="overlay" />
            <div className="container">
                <div className="row footer-row">
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-widget">
                            <div className="footer-logo">
                                <Link to="/">
                                    <img
                                        src={FreshDealLogo}
                                        className="footer-logo-img"
                                        alt="FreshDeal Logo"
                                    />
                                </Link>
                            </div>
                            <p className="footer-description mb-30">
                                We are a team of passionate individuals who believe in the power of technology
                                to make a positive impact on the world. Our mission is to help you save money
                                and reduce food waste while enjoying delicious meals from your favorite local restaurants.
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-6">
                        <div className="footer-widget">
                            <h4 className="footer-widget-title">Quick Links</h4>
                            <ul className="footer-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                {/* Removed Contact Link */}
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="footer-widget">
                            <h4 className="footer-widget-title">For Restaurants</h4>
                            <ul className="footer-links">
                                <li><a href="https://lively-bush-0a480ff03.6.azurestaticapps.net/" target="_blank" rel="noopener noreferrer">Partner with Us</a></li>
                                {/* Removed Restaurant FAQ Link */}
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="footer-widget">
                            <h4 className="footer-widget-title">Follow Us</h4>
                            <div className="footer-social">
                                <a href="https://github.com/FreshDealApp" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-github"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bar">
                <div className="container text-center">
                    <div className="footer-copy">
                        <div className="copyright">
                            © {year} FreshDeal | All Rights Reserved
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .footer {
                    background-color: #f8f9fa;
                    padding: 60px 0 0;
                    position: relative;
                    color: #333;
                }
                
                .footer-row {
                    margin-bottom: 40px;
                }
                
                .footer-logo {
                    margin-bottom: 20px;
                }
                
                .footer-logo-img {
                    width: 200px;
                    height: auto;
                }
                
                .footer-description {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #666;
                }
                
                .footer-widget-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    position: relative;
                    padding-bottom: 10px;
                    color: #50703C;
                }
                
                .footer-widget-title:after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 40px;
                    height: 2px;
                    background-color: #50703C;
                }
                
                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .footer-links li {
                    margin-bottom: 12px;
                }
                
                .footer-links a {
                    color: #666;
                    text-decoration: none;
                    transition: color 0.3s;
                    font-size: 14px;
                }
                
                .footer-links a:hover {
                    color: #50703C;
                }
                
                .footer-social {
                    display: flex;
                    gap: 15px;
                }
                
                .footer-social a {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background-color: #f0f0f0;
                    color: #50703C;
                    transition: all 0.3s;
                }
                
                .footer-social a:hover {
                    background-color: #50703C;
                    color: white;
                    transform: translateY(-3px);
                }
                
                .footer-bar {
                    padding: 20px 0;
                    border-top: 1px solid #eaeaea;
                    background-color: #f0f0f0;
                }
                
                .copyright {
                    font-size: 14px;
                    color: #777;
                }
                
                @media (max-width: 768px) {
                    .footer {
                        padding: 40px 0 0;
                    }
                    
                    .footer-widget {
                        margin-bottom: 30px;
                    }
                    
                    .footer-widget-title {
                        margin-bottom: 15px;
                    }
                    
                    .footer-logo-img {
                        width: 180px;
                    }
                }
            `}</style>
        </footer>
    );
}

export default Footer;

