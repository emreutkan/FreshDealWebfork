import { useState, useEffect } from "react";
import signinimage from "@src/images/signin-g.svg";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "@src/redux/thunks/userThunks.js";
import ScrollToTop from "./ScrollToTop.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const { isLoading, error, token } = userState;

  const [loginType, setLoginType] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
      password_login: true,
    };

    console.log("Login - Before dispatch - User State:", userState);
    const result = await dispatch(loginUserThunk(payload));
    console.log("Login - After dispatch - Auth Result:", result);

    const currentToken = result.payload?.token;
    console.log("Login - After dispatch - Token:", currentToken);

    if (result.payload?.success) {
      console.log("Login Successful - Token before navigation:", currentToken);
      sessionStorage.setItem('lastLoginToken', currentToken);
      sessionStorage.setItem('loginTimestamp', new Date().toISOString());
      navigate("/");
    }
  };

  return (
      <div>
        <ScrollToTop />
        <section className="my-lg-14 my-8">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-md-6 col-lg-5 order-lg-1 order-2">
                <img src={signinimage} alt="freshcart" className="img-fluid" />
              </div>

              <div className="col-12 col-md-6 offset-lg-1 col-lg-5 order-lg-2 order-1">
                <div className="mb-lg-9 mb-5">
                  <h1 className="mb-1 h2 fw-bold">Welcome back to FreshDeal</h1>
                  <p className="mb-0 text-muted">
                    Save money and reduce waste by purchasing surplus food at discounted prices.
                  </p>
                </div>

                <div className="card shadow border-0 mb-3">
                  <div className="card-body p-lg-5 p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="btn-group login-type-toggle w-100" role="group">
                        <button
                            type="button"
                            className={`btn ${loginType === "email" ? "btn-success" : "btn-outline-secondary"}`}
                            onClick={() => setLoginType("email")}
                        >
                          <i className="bi bi-envelope me-2"></i>Email
                        </button>
                        <button
                            type="button"
                            className={`btn ${loginType === "phone_number" ? "btn-success" : "btn-outline-secondary"}`}
                            onClick={() => setLoginType("phone_number")}
                        >
                          <i className="bi bi-phone me-2"></i>Phone
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        {loginType === "email" ? (
                            <div className="col-12">
                              <div className="form-floating">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="inputEmail"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="inputEmail">Email Address</label>
                              </div>
                            </div>
                        ) : (
                            <div className="col-12">
                              <div className="form-floating">
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
                                <label htmlFor="inputPhone">Phone Number</label>
                              </div>
                            </div>
                        )}

                        <div className="col-12">
                          <div className="form-floating position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="inputPassword"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="inputPassword">Password</label>
                            <button
                                type="button"
                                className="btn position-absolute end-0 top-50 translate-middle-y me-3"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ background: 'none', border: 'none' }}
                            >
                              <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                            </button>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between">
                          <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                              Remember me
                            </label>
                          </div>
                          <div>
                            <Link to="/ForgotPassword" className="text-success">Forgot password?</Link>
                          </div>
                        </div>

                        {error && (
                            <div className="col-12">
                              <div className="alert alert-danger" role="alert">
                                {userState.error?.payload?.message || error}
                              </div>
                            </div>
                        )}

                        <div className="col-12 d-grid mt-4">
                          <button
                              type="submit"
                              className="btn btn-success btn-lg"
                              disabled={isLoading}
                          >
                            {isLoading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="card shadow border-0">
                  <div className="card-body p-4 text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <span>Don't have an account?</span>
                      <Link to="/register" className="text-success fw-semibold">Create Account</Link>
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

export default Login;

