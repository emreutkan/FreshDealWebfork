import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import signinimage from "@src/images/signin-g.svg";
import ScrollToTop from "./ScrollToTop.jsx";
import { forgotPassword } from "@src/redux/api/authAPI";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await dispatch(forgotPassword({ email }));
      setMessage({
        type: "success",
        text: "Password reset instructions have been sent to your email.",
      });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.message || "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
                <h1 className="mb-1 h2 fw-bold">Forgot Password</h1>
                <p className="mb-0 text-muted">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <div className="card shadow border-0 mb-3">
                <div className="card-body p-lg-5 p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="email"
                            className="form-control"
                            id="inputEmail"
                            name="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <label htmlFor="inputEmail">Email Address</label>
                        </div>
                      </div>

                      {message.text && (
                        <div className="col-12">
                          <div className={`alert alert-${message.type}`} role="alert">
                            {message.text}
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
                              Sending...
                            </>
                          ) : (
                            "Reset Password"
                          )}
                        </button>
                      </div>

                      <div className="col-12 text-center mt-3">
                        <Link to="/login" className="text-success">
                          Back to Login
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
