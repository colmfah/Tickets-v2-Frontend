import React from 'react'
import {Redirect, BrowserRouter, Switch, Route} from 'react-router-dom'
import LogIn from './LogIn'
import CreateEvent from './CreateEvent'
import SignUp from './SignUp'
import Events from './Events'
import Event from './Event'
import CheckIn from './CheckIn'
import Tickets from './Tickets'
import MyEvents from './MyEvents'
import MyEvent from './MyEvent'
import confirmEmail from './confirmEmail'
import StripeConnectSignUp from './StripeConnectSignUp'
import ForgotPassword from './ForgotPassword'
import ChangePassword from './ChangePassword'
import ShowQRCode from './QRCode'
import WaitLists from './WaitLists'
import Test from './Test'
import ContactUs from './ContactUs'




class Routes extends React.Component {

	state = {

	}

	tokenCheck = () => {
	let token = localStorage.getItem('token')
	if (token){return true}
	return false
	}



	render() {

	

	  return (

			<BrowserRouter>
				<Switch>
					<Route path='/checkin/:id' component={CheckIn} />
					<Route path='/changepassword' component={() => this.tokenCheck() ? <ChangePassword /> : <Redirect to="/login" /> } />
					<Route path='/confirmEmail/:id' component={confirmEmail} />
					<Route path='/createevent' render={ () => this.tokenCheck() ? <CreateEvent /> : <Redirect to="/stripeConnectSignUp" /> }/>
					<Route path='/events/:id' component={Event} />
					<Route path='/events' component={Events} />
					<Route path='/forgotPassword' component={ForgotPassword} />
					<Route path='/login' component={LogIn} />
					<Route path='/qr/:id' component={ShowQRCode} />
					<Route path='/tickets' render={ () => this.tokenCheck() ? <Tickets /> : <Redirect to="/login" /> }/>
					<Route path='/signup' component={SignUp} />
					{/* <Route path='/stripeConnectSignUp' render={ () => this.tokenCheck() ? <StripeConnectSignUp /> : <Redirect to="/login" /> }/> */}
					{/* reinstate token check when finished amending page */}
					<Route path='/stripeConnectSignUp' render={ () =>  <StripeConnectSignUp />}/>
					<Route path='/waitLists' render={ () => this.tokenCheck() ? <WaitLists /> : <Redirect to="/login" /> }/>
					<Route path='/myevents' render={ () => this.tokenCheck() ? <MyEvents /> : <Redirect to="/login" /> }/>
					<Route path='/myevent/:id' component={MyEvent}/>
					<Route path='/test' component={Test} />
					<Route path='/contactUs' component={ContactUs} />
					<Route path='/' component={Events} />
				</Switch>
			</BrowserRouter>

		)
}
}





export default Routes
