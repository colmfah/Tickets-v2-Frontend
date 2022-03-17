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
          <div className="nav-spacing">
            <li className="nav-link-wrapper">
                <NavLink
                  exact
                  activeClassName="nav-current-page"
                  className="nav-btn"
                  to={`/events`}
                >
                  Events
                </NavLink>
              </li>
            </div>
       
        
            <div className="nav-spacing">
              <li className="nav-link-wrapper">
                <NavLink
                  exact
                  activeClassName="nav-current-page"
                  className="nav-btn"
                  to={`/createevent`}
                >
                  Create Event
                </NavLink>
              </li>
            </div>

            <div className="nav-spacing">
              <li>
                <div className="nav-account">
                  My Account
                  <ul className="nav-dropdown">
                    <li className="nav-sub-link nav-link-wrapper">
                      <NavLink
                        className="nav-btn"
                        to={`/tickets`}
                      >
                        My Tickets
                      </NavLink>
                    </li>
                    <li className="nav-sub-link nav-link-wrapper">
                      <NavLink
                        to={`/waitLists`}
                        className="nav-btn"
                      >
                        My WaitLists
                      </NavLink>
                    </li>
                  
                    <li className="nav-sub-link nav-link-wrapper">
                      <NavLink
                        to={`/myevents`}
                        className="nav-btn"
                      >
                        My Events
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            </div>
            
            <div className="nav-spacing">
              <li className="nav-link-wrapper">
                <div className="nav-btn" onClick={this.logout}>
                  Log Out
                </div>
              </li>
            </div>
          </ul>
        ) : (
          <ul id="loggedOut">
            <div className="nav-spacing">
              <li className="nav-link-wrapper">
                <NavLink
                  exact
                  activeClassName="nav-current-page"
                  className="nav-btn"
                  to={`/events`}
                >
                  Events
                </NavLink>
              </li>
            </div>

            <div className="nav-spacing">
              <li className="nav-link-wrapper">
                <NavLink
                  exact
                  activeClassName="nav-current-page"
                  className="nav-btn"
                  to={`/signup`}
                >
                  Sign Up
                </NavLink>
              </li>
            </div>

            <div className="nav-spacing">
              <li className="nav-link-wrapper">
                <NavLink
                  exact
                  activeClassName="nav-current-page"
                  className="nav-btn"
                  to={`/login`}
                >
                  Log In
                </NavLink>
              </li>
            </div>
          </ul>
        )}
      </nav>
    );
  }
}

export default withRouter(Nav);
