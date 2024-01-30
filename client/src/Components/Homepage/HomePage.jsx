import React from "react";
import "./HomePage.css";
import { NavLink, useNavigate, Outlet } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/", { state: { form: "login" } });
  };

  return (
    <div className="homePageContainer">
      <h1 className="title">QUIZZES</h1>
      <div className="sidebar-container">
        <div className="sidebar">
          <NavLink
            to="/homepage/dashboard"
            className={({ isActive }) =>
              isActive ? "button active" : "button"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/homepage/analytics"
            className={({ isActive }) =>
              isActive ? "button active" : "button"
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="/homepage/createQuiz"
            className={({ isActive }) =>
              isActive ? "button active" : "button"
            }
          >
            Create Quiz
          </NavLink>
          <button className="logout-button button" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default HomePage;
