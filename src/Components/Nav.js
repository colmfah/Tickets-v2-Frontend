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
					<div id="loggedIn">
						<div></div>			
						<Link to={`/events`} >Events</Link>
						<Link to={`/createevent`}>Create Event</Link>
						<Link to={`/tickets`}>My Account</Link>
						<div id="logOut" onClick={this.logout}>Log Out</div>
					</div>
					:
					<div id="loggedOut">
						
						<div></div>
						<Link to={`/events`}>Events</Link> 
						<Link to={`/signup`}>Sign Up</Link> 
						<Link to={`/login`} >Login</Link> 
						
						
					</div>
				}
      		</nav>
    )
  }
}

export default withRouter(Nav)
