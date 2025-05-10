import React, { useContext, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Header from '@src/components/Header';
import Footer from "@src/components/Footer";
import Home from "./pages/Home";

import Shop from "./pages/Shop/Shop";
import ShopDetail from "./pages/Shop/ShopDetail";

import ShopCart from "./pages/Shop/ShopCart";
import ShopCheckOut from "./pages/Shop/ShopCheckOut";
import MyAccountOrder from "./pages/Accounts/MyAccountOrder";
import MyAccountSetting from "./pages/Accounts/MyAcconutSetting";
import AddressSelection from "./pages/AddressSelection.jsx";
import MyAccountForgetPassword from "./pages/Accounts/MyAccountForgetPassword";
import Login from "./pages/Accounts/login.jsx";
import Register from "./pages/Accounts/register.jsx";
import ErrorPage from "@src/pages/ErrorPage";
import GlobalResetContext from "@src/context/GlobalResetContext";

function App() {
    const { resetKey } = useContext(GlobalResetContext);

    return (
        <div>
            <Router>
                <Header />

                    <Routes key={resetKey}>
                        <Route path="/" element={<Home />} />
                        <Route path="/Restaurants" element={<Shop />} />
                        <Route path="/Restaurant/:id" element={<ShopDetail />} />
                        <Route path="/CheckOut" element={<><ShopCheckOut /></>} />
                        <Route path="/Cart" element={<><ShopCart /></>} />
                        <Route path="/MyAccountOrder" element={<><MyAccountOrder /></>} />
                        <Route path="/MyAccountSetting" element={<><MyAccountSetting /></>} />
                        <Route path="/Address" element={<><AddressSelection /></>} />
                        <Route path="/MyAccountForgetPassword" element={<MyAccountForgetPassword />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/Register" element={<Register />} />

                        <Route path="*" element={<ErrorPage />} />
                    </Routes>

                <Footer />
            </Router>
        </div>
    )
}

export default App;