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


				{this.tokenCheck() ?
					<ul id="loggedIn">
				
						
						<Link to={`/events`}>	
							<li>
								<div class="nav-btn">
									Events
								</div>
							</li>	
						</Link> 


						<Link to={`/createevent`}>	
							<li>
								<div class="nav-btn">
									Create Event
								</div>
							</li>	
						</Link> 

						<Link to={`/tickets`}>	
							<li>
								<div class="nav-btn">
									My Account
								</div>
							</li>	
						</Link> 

					
						<li>
							<div class="nav-btn" onClick={this.logout}>
								Log Out
							</div>
						</li>	
					</ul>
					:
					<ul id="loggedOut">

						<Link to={`/events`}>	
							<li>
								<div class="nav-btn">
									Events
								</div>
							</li>	
						</Link> 

						<Link to={`/signup`}>	
							<li>
								<div class="nav-btn">
									Sign Up
								</div>
							</li>	
						</Link> 

						<Link to={`/login`}>	
							<li>
								<div class="nav-btn">
									Log In
								</div>
							</li>	
						</Link> 

					</ul>
				}
      		</nav>
    )
  }
}


export default withRouter(Nav)
