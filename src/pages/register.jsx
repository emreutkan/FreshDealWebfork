import React, { useState } from "react";
import signupimage from '@src/images/signup-g.svg';
import { Link, useNavigate } from "react-router";
import ScrollToTop from "./ScrollToTop.jsx";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk, loginUserThunk, getUserDataThunk } from "@src/redux/thunks/userThunks.js";
import { setEmail, setName, setPassword, setPhoneNumber, setSelectedCode, setToken } from "@src/redux/slices/userSlice.js";
import { verifyCode } from "@src/redux/api/authAPI.js";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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
    if (!password || password.length < 6) {
      return false;
    }
    if (!agreedToTerms) {
      return false;
    }
    return true;
  };

  const checkPasswordStrength = (pwd) => {
    let score = 0;

    // Length check
    if (pwd.length >= 8) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    setPasswordStrength(score);
    return score;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    dispatch(setPassword(newPassword));
    checkPasswordStrength(newPassword);
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

  const renderPasswordStrength = () => {
    const getColorClass = () => {
      if (passwordStrength === 0) return 'bg-danger';
      if (passwordStrength === 1) return 'bg-danger';
      if (passwordStrength === 2) return 'bg-warning';
      if (passwordStrength === 3) return 'bg-info';
      return 'bg-success';
    };

    const getStrengthText = () => {
      if (passwordStrength === 0) return 'Very Weak';
      if (passwordStrength === 1) return 'Weak';
      if (passwordStrength === 2) return 'Medium';
      if (passwordStrength === 3) return 'Strong';
      return 'Very Strong';
    };

    return (
        <div className="mt-1">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small className="text-muted">Password Strength:</small>
            <small className={`fw-bold ${getColorClass().replace('bg-', 'text-')}`}>{getStrengthText()}</small>
          </div>
          <div className="progress" style={{ height: '5px' }}>
            <div
                className={`progress-bar ${getColorClass()}`}
                role="progressbar"
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
                aria-valuenow={passwordStrength}
                aria-valuemin="0"
                aria-valuemax="4">
            </div>
          </div>
        </div>
    );
  };

  return (
      <div>
        <ScrollToTop/>
        <section className="my-lg-14 my-8">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-md-6 col-lg-5 order-lg-1 order-2">
                <img
                    src={signupimage}
                    alt="freshcart"
                    className="img-fluid"
                />
              </div>

              <div className="col-12 col-md-6 offset-lg-1 col-lg-5 order-lg-2 order-1">
                <div className="mb-lg-7 mb-4">
                  <h1 className="mb-1 h2 fw-bold">
                    {!isCodeSent ? "Create your account" : "Verify your email"}
                  </h1>
                  <p className="mb-0 text-muted">
                    {!isCodeSent
                        ? "Join FreshDeal to reduce food waste while saving money!"
                        : "Enter the 6-digit code sent to your email address."
                    }
                  </p>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {error}
                      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

                <div className="card shadow border-0 mb-3">
                  <div className="card-body p-lg-5 p-4">
                    {!isCodeSent ? (
                        <form onSubmit={handleRegister}>
                          <div className="row g-3">
                            <div className="col-12">
                              <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fullName"
                                    placeholder="Full Name"
                                    value={name_surname}
                                    onChange={(e) => dispatch(setName(e.target.value))}
                                    required
                                />
                                <label htmlFor="fullName">Full Name</label>
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="form-floating">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="emailAddress"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => dispatch(setEmail(e.target.value))}
                                    required
                                />
                                <label htmlFor="emailAddress">Email Address</label>
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="input-group">
                                <select
                                    className="form-select flex-grow-0"
                                    style={{ width: '120px' }}
                                    value={selectedCode}
                                    onChange={(e) => dispatch(setSelectedCode(e.target.value))}
                                    aria-label="Country code"
                                >
                                  {areaCodes.map((code) => (
                                      <option key={code.code} value={code.code}>
                                        {code.code} {code.country}
                                      </option>
                                  ))}
                                </select>
                                <div className="form-floating flex-grow-1">
                                  <input
                                      type="tel"
                                      className="form-control"
                                      id="phoneNumber"
                                      placeholder="Phone Number"
                                      value={phoneNumber}
                                      onChange={handlePhoneNumberChange}
                                  />
                                  <label htmlFor="phoneNumber">Phone Number</label>
                                </div>
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="form-floating position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <label htmlFor="password">Password</label>
                                <button
                                    type="button"
                                    className="btn position-absolute end-0 top-50 translate-middle-y me-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ background: 'none', border: 'none' }}
                                >
                                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                </button>
                              </div>
                              {password && renderPasswordStrength()}
                              <small className="text-muted d-block mt-1">
                                Use 8+ characters with a mix of uppercase, lowercase, numbers & symbols.
                              </small>
                            </div>

                            <div className="col-12">
                              <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="agreeTerms"
                                    checked={agreedToTerms}
                                    onChange={() => setAgreedToTerms(!agreedToTerms)}
                                    required
                                />
                                <label className="form-check-label" htmlFor="agreeTerms">
                                  I agree to FreshDeal's <Link to="#!" className="text-success">Terms of Service</Link> & <Link to="#!" className="text-success">Privacy Policy</Link>
                                </label>
                              </div>
                            </div>

                            <div className="col-12 d-grid mt-3">
                              <button
                                  type="submit"
                                  className="btn btn-success btn-lg"
                                  disabled={loading || !validateInput()}
                              >
                                {loading ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                      Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyCode}>
                          <div className="text-center mb-4">
                            <div className="badge bg-light-success text-success p-3 mb-3">
                              <i className="bi bi-envelope-check fs-4 d-block mb-1"></i>
                              Verification Code Sent
                            </div>
                            <p className="text-muted">We've sent a 6-digit verification code to <strong>{email}</strong></p>
                          </div>

                          <div className="row g-3">
                            <div className="col-12">
                              <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control text-center fs-4"
                                    id="verificationCode"
                                    placeholder="Verification code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    maxLength={6}
                                    required
                                />
                                <label htmlFor="verificationCode">6-Digit Code</label>
                              </div>
                            </div>

                            <div className="col-12 d-grid mt-3">
                              <button
                                  type="submit"
                                  className="btn btn-success btn-lg"
                                  disabled={loading || verificationCode.length !== 6}
                              >
                                {loading ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                      Verifying...
                                    </>
                                ) : (
                                    "Verify Email"
                                )}
                              </button>
                            </div>

                            <div className="col-12 text-center mt-3">
                              <button
                                  type="button"
                                  className="btn btn-link text-success"
                                  onClick={skipLoginUser}
                              >
                                Verify Later
                              </button>
                            </div>
                          </div>
                        </form>
                    )}
                  </div>
                </div>

                <div className="card shadow border-0">
                  <div className="card-body p-4 text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <span>Already have an account?</span>
                      <Link to="/Login" className="text-success fw-semibold">Sign In</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Register;