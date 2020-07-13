import React from "react"
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router-dom'

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
				<Link to={`/events`}>
					Events
				</Link>

				{this.tokenCheck() ?
					<div>
					<Link to={`/tickets`}>
							Your Tickets
					</Link>

					<Link to={`/createevent`}>
						Create Event
					</Link>

					<Link to={`/yourevents`}>
						Your Events
					</Link>

					<div onClick={this.logout}>Log Out</div>
					</div>
					:
					<div>
						<Link to={`/signup`}>
							Sign Up
						</Link>

						<Link to={`/login`}>
							Login
						</Link>
					</div>
				}
      		</nav>
    )
  }
}

export default withRouter(Nav)
