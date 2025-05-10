import React, { useState, useEffect } from "react";
import signinimage from "@src/images/signin-g.svg";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "@src/redux/thunks/userThunks";
import ScrollToTop from "../ScrollToTop";

const MyAccountSignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const { isLoading, error, token } = userState;

  const [loginType, setLoginType] = useState("email"); // Toggle between email and phone
  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    password: "",
  });

  // Debug - Log token state when component mounts and when token changes
  useEffect(() => {
    console.log("Login Component - Initial Token State:", token);
  }, []);

  useEffect(() => {
    console.log("Login Component - Token Changed:", token);
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      login_type: loginType,
      password_login: true, // Assuming password-based login
    };

    console.log("Login - Before dispatch - User State:", userState);
    const result = await dispatch(loginUserThunk(payload));
    console.log("Login - After dispatch - Auth Result:", result);

    // We need to get the current state AFTER the dispatch
    const currentToken = result.payload?.token;
    console.log("Login - After dispatch - Token:", currentToken);

    if (result.payload?.success) {
      console.log("Login Successful - Token before navigation:", currentToken);
      // Store debugging info in sessionStorage to track token across page navigations
      sessionStorage.setItem('lastLoginToken', currentToken);
      sessionStorage.setItem('loginTimestamp', new Date().toISOString());
      navigate("/"); // Forwarding user upon successful login
    }
  };

  return (
      <div>
        <ScrollToTop />
        <section className="my-lg-14 my-8">
          <div className="container">
            {/* row */}
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
                {/* img */}
                <img src={signinimage} alt="freshcart" className="img-fluid" />
              </div>
              {/* col */}
              <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
                <div className="mb-lg-9 mb-5">
                  <h1 className="mb-1 h2 fw-bold">Sign in to FreshDeal</h1>
                  <p>
                    Welcome back to FreshDeal! Enter your email or phone number to
                    get started.
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Toggle for login type */}
                    <div className="col-12">
                      <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="loginType"
                            id="emailLogin"
                            value="email"
                            checked={loginType === "email"}
                            onChange={() => setLoginType("email")}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="emailLogin"
                        >
                          Email
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="loginType"
                            id="phoneLogin"
                            value="phone"
                            checked={loginType === "phone"}
                            onChange={() => setLoginType("phone")}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="phoneLogin"
                        >
                          Phone
                        </label>
                      </div>
                    </div>

                    {/* Email or Phone input */}
                    {loginType === "email" ? (
                        <div className="col-12">
                          <input
                              type="email"
                              className="form-control"
                              id="inputEmail"
                              name="email"
                              placeholder="Email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                          />
                        </div>
                    ) : (
                        <div className="col-12">
                          <input
                              type="tel"
                              className="form-control"
                              id="inputPhone"
                              name="phone_number"
                              placeholder="Phone Number"
                              value={formData.phone_number}
                              onChange={handleChange}
                              required
                          />
                        </div>
                    )}

                    {/* Password input */}
                    <div className="col-12">
                      <input
                          type="password"
                          className="form-control"
                          id="inputPassword"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                      />
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="col-12">
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        </div>
                    )}

                    {/* Submit button */}
                    <div className="col-12">
                      <button
                          type="submit"
                          className="btn btn-primary w-100"
                          disabled={isLoading}
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default MyAccountSignIn;