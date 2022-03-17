import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from "axios";
import Nav from "./Nav";
import "../Styles/stripe.css";
import "../Styles/StripeConnectSignUp.css";
import Footer from "./Footer";

class StripeConnectSignUp extends React.Component {

	state = {
		error: false,
		code: false,
		readAndWrite: false,
		message: '',
	}

	componentDidMount(){

		const token = localStorage.getItem("token")
		const query = new URLSearchParams(this.props.location.search)
		const code = query.get('code')
		const scope = query.get('scope')
		const error = query.get('error')

		if (error){
			this.setState({error: true, message: error})
		} else if (scope && scope !=='read_write'){
			this.setState({error: true, message: 'Error. You must enable read & write access to your stripe account'})
		}
		else if (code && scope === 'read_write'){
			this.setState({error: false, code: code, readAndWrite: true, message: 'Please Wait. Updating your account....'})
			const objectToSend = {
				token: token,
				code: code,
				scope: scope,
			}

			axios.patch(`${process.env.REACT_APP_API}/sellersStripeDetails`, objectToSend).then(res => {
				this.setState({message: res.data.message})})
				.catch(err => console.log(err))
		}
	}

	render() {

	  return (
		<div className="check-in-container">
		<Nav />
			<div className="check-in-form stripe-connect-sign-up-box">	
				{(this.state.error === false && this.state.code === false && this.state.readAndWrite === false)? 
						<>	
						<p>In order to sell tickets you must connect your stripe account to our platform</p>
						<p>Please click the below button to enable this</p>
						<p>You will be brought to Stripe's website</p>
						<p>You can log into your stripe account or create a new stripe account if you don't already have one</p>
						<p>Please follow the instructions on Stripe's websites</p>
						<p>When you have completed all steps, you will be redirected back to this website</p>

						<a href='https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_GIwo6n5S0Lvl8NZ5RmYGDCSuUvx0OAsM&scope=read_write' className="stripe-connect dark"><span>Connect with Stripe</span></a>
						</>
				: <div>{this.state.message}</div>}
			</div> 
		<Footer />
		</div>

			)
	}
}

export default withRouter(StripeConnectSignUp)
