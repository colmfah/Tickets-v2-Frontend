import React from 'react'
import {Redirect, BrowserRouter, Switch, Route} from 'react-router-dom'
import LogIn from './LogIn'
import CreateEvent from './CreateEvent'
import SignUp from './SignUp'
import Events from './Events'
import Event from './Event'
import Profile from './Profile'
import ShowQRCode from './QRCode'

class Routes extends React.Component {

	state = {

	}

	tokenCheck = () => {
	let token = localStorage.getItem('token')
	if (token){
		return true
	}else {
		return false
	}
}

	render() {

	  return (
			<BrowserRouter>
				<Switch>
					<Route path='/createevent' render={ () => this.tokenCheck() ? <CreateEvent /> : <Redirect to="/login" /> }/>
					<Route path='/events/:id' component={Event} />
					<Route path='/events' component={Events} />
					<Route path='/login' component={LogIn} />
					<Route path='/profile' render={ () => this.tokenCheck() ? <Profile /> : <Redirect to="/login" /> }/>
					<Route path='/qr/:id' component={ShowQRCode} />
					<Route path='/signup' component={SignUp} />
					<Route path='/' component={Events} />
				</Switch>
			</BrowserRouter>
		)
}
}




export default Routes
