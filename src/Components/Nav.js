import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { NavLink } from "react-router-dom";

import "../Styles/Nav.css";

class Nav extends React.Component {
  tokenCheck = () => {
    let token = localStorage.getItem("token");
    if (token) {
      return true;
    } else {
      return false;
    }
  };

  logout = () => {
    localStorage.removeItem("token");
    this.props.history.push({
      pathname: "/events",
    });
  };

  subLinkHovered = () => {};

  render() {
    return (
      <nav>
        {this.tokenCheck() ? (
          <ul id="loggedIn">
            <li>
              <NavLink
                exact
                activeClassName="nav-current-page"
                className="nav-btn"
                to={`/events`}
              >
                Events
              </NavLink>
            </li>

            <li>
              <NavLink
                exact
                activeClassName="nav-current-page"
                className="nav-btn"
                to={`/createevent`}
              >
                Create Event
              </NavLink>
            </li>

            <li>
              <div className="nav-account">
                My Account
                <ul className="nav-dropdown">
                  <li className="nav-sub-link ">
                    <a href="#" className="nav-btn">
                      Profile
                    </a>
                  </li>
                  <li className="nav-sub-link">
                    <Link
                      to={`/tickets`}
                    >
                      Tickets
                    </Link>
                  </li>
                  {/* to={`/tickets`}to={`/tickets`} */}
                  <li className="nav-sub-link">
                    <a href="#" className="nav-btn">
                      Events
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <div className="nav-btn" onClick={this.logout}>
                Log Out
              </div>
            </li>
          </ul>
        ) : (
          <ul id="loggedOut">
            <li>
              <NavLink
                exact
                activeClassName="nav-current-page"
                className="nav-btn"
                to={`/events`}
              >
                Events
              </NavLink>
            </li>

            <li>
              <NavLink
                exact
                activeClassName="nav-current-page"
                className="nav-btn"
                to={`/signup`}
              >
                Sign Up
              </NavLink>
            </li>

            <li>
              <NavLink
                exact
                activeClassName="nav-current-page"
                className="nav-btn"
                to={`/login`}
              >
                Log In
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
    );
  }
}

export default withRouter(Nav);
