import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.css";
import BaseUrl from "../BaseUrl/BaseUrl";

const Register = () => {
  const [show, setShow] = useState("signup");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.form) {
      setShow(location.state.form);
    }
  }, [location]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateSignup = () => {
    let tempErrors = {};

    if (!user.name) {
      tempErrors.name = "Name is required";
    }

    if (!user.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      tempErrors.email = "Invalid Email";
    }

    if (!user.password) {
      tempErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (user.confirmPassword !== user.password) {
      tempErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateLogin = () => {
    let tempErrors = {};
    if (!user.email) tempErrors.email = "Email is required";
    if (!user.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (validateSignup()) {
      fetch(`${BaseUrl}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              toast.error("User already exists");
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setShow("login");
        })
        .catch((error) => {
          console.error("Error during signup:", error);
        });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateLogin()) {
      fetch(`${BaseUrl}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Login failed with status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          toast.success("Login Successfully!");
          navigate("/homepage/dashboard");
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Invalid email or password");
        });
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">QUIZZIE</div>
      <div className="register-buttons">
        <button
          className={`register-button ${show === "signup" ? "active" : ""}`}
          onClick={() => setShow("signup")}
        >
          Sign Up
        </button>
        <button
          className={`register-button ${show === "login" ? "active" : ""}`}
          onClick={() => setShow("login")}
        >
          Log In
        </button>
      </div>

      {show === "signup" && (
        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group-register">
            <label htmlFor="name" className="input-label-register">
              Name
            </label>
            <input
              className={`form-input ${errors.name ? "input-error" : ""}`}
              type="text"
              name="name"
              id="name"
              value={user.name}
              onChange={handleChange}
              placeholder={errors.name}
            />
          </div>
          <div className="form-group-register">
            <label htmlFor="email" className="input-label-register">
              Email
            </label>
            <input
              className={`form-input ${errors.email ? "input-error" : ""}`}
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              placeholder={errors.email}
            />
          </div>
          <div className="form-group-register">
            <label htmlFor="password" className="input-label-register">
              Password
            </label>
            <input
              className={`form-input ${errors.password ? "input-error" : ""}`}
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              placeholder={errors.password}
            />
          </div>
          <div className="form-group-register">
            <label htmlFor="confirmPassword" className="input-label-register">
              Confirm Password
            </label>
            <input
              className={`form-input ${
                errors.confirmPassword ? "input-error" : ""
              }`}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              placeholder={errors.confirmPassword}
            />
          </div>
          <button className="submit-button" type="submit">
            Sign Up
          </button>
        </form>
      )}

      {show === "login" && (
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group-register">
            <label htmlFor="email" className="input-label-register">
              Email
            </label>
            <input
              className={`form-input ${errors.email ? "input-error" : ""}`}
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              placeholder={errors.email}
            />
          </div>
          <div className="form-group-register">
            <label htmlFor="password" className="input-label-register">
              Password
            </label>
            <input
              className={`form-input ${errors.password ? "input-error" : ""}`}
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              placeholder={errors.password}
            />
          </div>
          <button className="submit-button" type="submit">
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
