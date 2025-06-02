import React, { useContext, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Header from '@src/components/Header';
import Footer from "@src/components/Footer";
import Home from "./pages/Home";

import RestaurantDetails from "./pages/RestaurantDetails.jsx";


import AddressSelection from "./pages/AddressSelection.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ErrorPage from "@src/pages/ErrorPage";
import GlobalResetContext from "@src/context/GlobalResetContext";
import Cart from "@src/pages/Cart.jsx";
import Checkout from "@src/pages/Checkout.jsx";
import Account from "@src/pages/Account.jsx";
import Orders from "@src/pages/Orders.jsx";
import OrderDetails from "@src/pages/OrderDetails.jsx";
import About from "@src/pages/About.jsx";
import Achievements from "@src/pages/Achievements.jsx";
import Rankings from "@src/pages/Rankings.jsx";
import Favorites from "@src/pages/Favorites.jsx";
import RestaurantComments from "@src/pages/RestaurantComments.jsx";

function App() {
    const { resetKey } = useContext(GlobalResetContext);

    return (
        <div>
            <Router>
                <Header />

                    <Routes key={resetKey}>
                        <Route path="/" element={<Home />} />
                        <Route path="/Restaurant/:id" element={<RestaurantDetails />} />
                        <Route path="/Restaurant/:id/comments" element={<RestaurantComments />} />
                        <Route path="/RestaurantComments/:id" element={<RestaurantComments />} />

                        <Route path="/Address" element={<><AddressSelection /></>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/Register" element={<Register />} />
                        <Route path="/ForgotPassword" element={<ForgotPassword />} />
                        <Route path="/Cart" element={<Cart />} />
                        <Route path="/Account" element={<Account />} />
                        <Route path="/Checkout" element={<Checkout />} />
                        <Route path="/Orders" element={<Orders />} />
                        <Route path="/order/:id" element={<OrderDetails />} />
                        <Route path="/About" element={<About />} />
                        <Route path="/Achievements" element={<Achievements />} />
                        <Route path="/Rankings" element={<Rankings />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>

                <Footer />
            </Router>
        </div>
    )
}

export default App;

