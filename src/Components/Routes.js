import React from 'react'
import {Redirect, BrowserRouter, Switch, Route} from 'react-router-dom'
import LogIn from './LogIn'
import CreateEvent from './CreateEvent'
import SignUp from './SignUp'
import Events from './Events'
import Event from './Event'
import CheckIn from './CheckIn'
import Tickets from './Tickets'
import test from './test'
import ShowQRCode from './QRCode'
import YourEvents from './YourEvents'
import confirmEmail from './confirmEmail'
import StripeConnectSignUp from './StripeConnectSignUp'
import StripeProvider from "react-stripe-elements";
import ForgotPassword from './ForgotPassword'
import ChangePassword from './ChangePassword'



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
					<Route path='/checkin' component={CheckIn} />
					<Route path='/changepassword' component={() => this.tokenCheck() ? <ChangePassword /> : <Redirect to="/login" /> } />
					<Route path='/confirmEmail/:id' component={confirmEmail} />
					<Route path='/createevent' render={ () => this.tokenCheck() ? <CreateEvent /> : <Redirect to="/login" /> }/>
					<Route path='/events/:id' component={Event} />
					<Route path='/events' component={Events} />
					<Route path='/forgotPassword' component={ForgotPassword} />
					<Route path='/login' component={LogIn} />
					<Route path='/tickets' render={ () => this.tokenCheck() ? <Tickets /> : <Redirect to="/login" /> }/>
					<Route path='/qr/:id' component={ShowQRCode} />
					<Route path='/signup' component={SignUp} />
					<Route path='/stripeConnectSignUp' render={ () => this.tokenCheck() ? <StripeConnectSignUp /> : <Redirect to="/login" /> }/>
					<Route path='/test' component={test} />
					<Route path='/yourevents' render={ () => this.tokenCheck() ? <YourEvents /> : <Redirect to="/login" /> }/>
					<Route path='/' component={Events} />
				</Switch>
			</BrowserRouter>

		)
}
}





export default Routes
