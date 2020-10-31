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
								<div class="nav-btn" id="nav-home">
									<span class="nav-noselect">Events</span>
								</div>
							</li>	
						</Link> 


						<Link to={`/createevent`}>	
							<li>
								<div class="nav-btn" id="nav-create-event">
									<span class="nav-noselect">Create Event</span>
								</div>
							</li>	
						</Link> 

						<Link to={`/tickets`}>	
							<li>
								<div class="nav-btn" id="nav-create-event">
									<span class="nav-noselect">My Account</span>
								</div>
							</li>	
						</Link> 

					
						<li>
							<div class="nav-btn" id="nav-home">
								<span class="nav-noselect" onClick={this.logout}>Log Out</span>
							</div>
						</li>	
					</ul>
					:
					<ul id="loggedOut">

						<Link to={`/events`}>	
							<li>
								<div class="nav-btn" id="nav-home">
									<span class="nav-noselect">Events</span>
								</div>
							</li>	
						</Link> 

						<Link to={`/signup`}>	
							<li>
								<div class="nav-btn" id="nav-home">
									<span class="nav-noselect">Sign Up</span>
								</div>
							</li>	
						</Link> 

						<Link to={`/login`}>	
							<li>
								<div class="nav-btn" id="nav-home">
									<span class="nav-noselect">Log In</span>
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
