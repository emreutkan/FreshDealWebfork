import React, { useState } from "react";
import signupimage from '@src/images/signup-g.svg';
import { Link, useNavigate } from "react-router";
import ScrollToTop from "../ScrollToTop";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk, loginUserThunk, getUserDataThunk } from "@src/redux/thunks/userThunks";
import { setEmail, setName, setPassword, setPhoneNumber, setSelectedCode, setToken } from "@src/redux/slices/userSlice";
import { verifyCode } from "@src/redux/api/authAPI";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const userState = useSelector((state) => state.user);
  const {
    name_surname,
    email,
    phoneNumber,
    password,
    selectedCode,
    loading,
    error
  } = userState;

  const areaCodes = [
    { code: "+90", country: "Turkey" },
    { code: "+1", country: "USA/Canada" },
    { code: "+44", country: "UK" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" }
  ];

  const validateInput = () => {
    if (!name_surname) {
      return false;
    }
    if (!email && !phoneNumber) {
      return false;
    }
    if (!password) {
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Register button pressed");

    if (!validateInput()) {
      console.log("Validation failed");
      return;
    }

    console.log("Input validated");

    try {
      const result = await dispatch(
          registerUserThunk({
            name_surname,
            email,
            phone_number: phoneNumber ? selectedCode + phoneNumber : "",
            password,
            role: "customer",
          })
      ).unwrap();

      console.log("Result = ", result);

      if (result.success) {
        setIsCodeSent(true);
        console.log("Registration successful, verification code sent");
      }
    } catch (error) {
      console.log("Registration error:", error);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      console.log("Verification code must be 6 digits");
      return;
    }

    try {
      const verifyResult = await dispatch(
          verifyCode({
            verification_code: verificationCode,
            email
          })
      ).unwrap();

      if (verifyResult.success) {
        console.log("Email verification successful");
        await skipLoginUser();
      }
    } catch (error) {
      console.log("Verification error:", error);
    }
  };

  const skipLoginUser = async () => {
    try {
      const loginResult = await dispatch(
          loginUserThunk({
            email: email,
            phone_number: phoneNumber ? selectedCode + phoneNumber : "",
            password: password,
            login_type: "email",
            password_login: true,
          })
      ).unwrap();

      if (loginResult) {
        console.log("Login successful after registration");
        dispatch(setToken(loginResult.token));
        dispatch(getUserDataThunk({token: loginResult.token}));
        navigate("/");
      }
    } catch (error) {
      console.log("Auto-login error:", error);
    }
  };

  const handlePhoneNumberChange = (e) => {
    // Only allow digits
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    dispatch(setPhoneNumber(value));
  };

  return (
      <div>
        <ScrollToTop/>
        <section className="my-lg-14 my-8">
          <div className="container">
            {/* row */}
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
                {/* img */}
                <img
                    src={signupimage}
                    alt="freshcart"
                    className="img-fluid"
                />
              </div>
              {/* col */}
              <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
                <div className="mb-lg-9 mb-5">
                  <h1 className="mb-1 h2 fw-bold">
                    {!isCodeSent ? "Get Started Shopping" : "Verify Email"}
                  </h1>
                  <p>
                    {!isCodeSent
                        ? "Welcome to FreshDeal! Fill in your details to create an account."
                        : "Enter the 6-digit code sent to your email."
                    }
                  </p>
                </div>

                {/* Error display */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                )}

                {/* Registration form */}
                {!isCodeSent ? (
                    <form onSubmit={handleRegister}>
                      <div className="row g-3">
                        {/* Name input */}
                        <div className="col-12">
                          <input
                              type="text"
                              className="form-control"
                              placeholder="Full Name"
                              value={name_surname}
                              onChange={(e) => dispatch(setName(e.target.value))}
                              required
                          />
                        </div>

                        {/* Email input */}
                        <div className="col-12">
                          <input
                              type="email"
                              className="form-control"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => dispatch(setEmail(e.target.value))}
                              required
                          />
                        </div>

                        {/* Phone number input with area code selector */}
                        <div className="col-12">
                          <div className="input-group">
                            <select
                                className="form-select flex-grow-0"
                                style={{ maxWidth: '120px' }}
                                value={selectedCode}
                                onChange={(e) => dispatch(setSelectedCode(e.target.value))}
                            >
                              {areaCodes.map((code) => (
                                  <option key={code.code} value={code.code}>
                                    {code.code} {code.country}
                                  </option>
                              ))}
                            </select>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                            />
                          </div>
                        </div>

                        {/* Password input */}
                        <div className="col-12 position-relative">
                          <input
                              type={showPassword ? "text" : "password"}
                              className="form-control"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => dispatch(setPassword(e.target.value))}
                              required
                          />
                          <button
                              type="button"
                              className="btn position-absolute end-0 top-0 mt-1 me-2"
                              onClick={() => setShowPassword(!showPassword)}
                              style={{ background: 'none', border: 'none' }}
                          >
                            <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                          </button>
                        </div>

                        {/* Register button */}
                        <div className="col-12 d-grid">
                          <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={loading}
                          >
                            {loading ? "Registering..." : "Register"}
                          </button>
                        </div>

                        {/* Login link */}
                        <div className="col-12 text-center mt-3">
                      <span>
                        Already have an account?{" "}
                        <Link to="/Login">Sign in</Link>
                      </span>
                        </div>

                        {/* Terms text */}
                        <div className="col-12 text-center">
                          <p>
                            <small>
                              By continuing, you agree to our{" "}
                              <Link to="#!"> Terms of Service</Link> &amp;{" "}
                              <Link to="#!">Privacy Policy</Link>
                            </small>
                          </p>
                        </div>
                      </div>
                    </form>
                ) : (
                    // Verification form
                    <form onSubmit={handleVerifyCode}>
                      <div className="row g-3">
                        {/* Verification code input */}
                        <div className="col-12">
                          <input
                              type="text"
                              className="form-control text-center"
                              placeholder="Enter 6-digit code"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                              maxLength={6}
                              required
                          />
                        </div>

                        {/* Verify button */}
                        <div className="col-12 d-grid">
                          <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={loading || verificationCode.length !== 6}
                          >
                            {loading ? "Verifying..." : "Verify Email"}
                          </button>
                        </div>

                        {/* Skip verification button */}
                        <div className="col-12 text-center mt-3">
                          <button
                              type="button"
                              className="btn btn-link"
                              onClick={skipLoginUser}
                          >
                            Skip Verification
                          </button>
                        </div>
                      </div>
                    </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Register;