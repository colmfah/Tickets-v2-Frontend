import React from "react"
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import '../Styles/Nav.css'

class Nav extends React.Component {





tokenCheck = () => {
	let token = localStorage.getItem('token')
	if (token){
		return true
	}else {
		return false
	}
}

logout = () => {
	localStorage.removeItem('token')
	this.props.history.push({
		pathname: '/events'
	})
}



  render() {
    return (

			<nav>
          <div id="wrapper">
            <input
              type="checkbox"
              id="menu"
              name="menu"
              className="menu-checkbox"
            />
            <div className="menu">
              <label className="menu-toggle" htmlFor="menu">
                <span>Toggle</span>
              </label>
              <ul>
                <li>
                  <div className="logo-container">
                    <i className="fas fa-ticket-alt" id="ticket"></i>
                  </div>
                </li>
								<Link to={`/events`} style={{ textDecoration: 'none' }}>
								<li>
									<label>Events</label>
									<input type="checkbox" className="menu-checkbox" />
								</li>
								</Link>

									{this.tokenCheck() ?
										<div>
											<Link to={`/profile`} style={{ textDecoration: 'none' }}>
											<li>
												<label>Your Profile</label>
												<input type="checkbox" className="menu-checkbox" />
											</li>
											</Link>
											<Link to={`/createevent`} style={{ textDecoration: 'none' }}>
											<li>
												<label>Create Event</label>
												<input type="checkbox" className="menu-checkbox" />
											</li>
											</Link>
											<li>
												<label onClick={this.logout}>Log Out</label>
												<input type="checkbox" className="menu-checkbox" />
											</li>
										</div>

									 :
									 <div>
										 <Link to={`/signup`} style={{ textDecoration: 'none' }}>
										 <li>
											 <label>Sign Up</label>
											 <input type="checkbox" className="menu-checkbox" />
										 </li>
										 </Link>
										 <Link to={`/login`} style={{ textDecoration: 'none' }}>
										 <li>
											 <label>Login</label>
											 <input type="checkbox" className="menu-checkbox" />
										 </li>
										 </Link>
									 </div>
									}
              </ul>
            </div>
            <div className="titlebar">
              <i className="fas fa-ticket-alt ticketTitle"></i>
              Eventzilla
            </div>
          </div>
      </nav>


    );
  }
}

export default withRouter(Nav)
