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
                        <Route path="/Restaurant/:id" element={<RestaurantDetails />} />
                        <Route path="/Address" element={<><AddressSelection /></>} />
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