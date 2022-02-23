import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from "axios";
import Nav from "./Nav";
import "../Styles/stripe.css";

class StripeConnectSignUp extends React.Component {

	state = {
		error: false,
		code: false,
		readAndWrite: false,
		message: '',
		name: ''
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
				name: this.state.name
			}

			axios.patch(`${process.env.REACT_APP_API}/sellersStripeDetails`, objectToSend).then(res => {
				this.setState({message: res.data.message})})
				.catch(err => console.log(err))
		}
	}

	render() {

	  return (
			<>
				<Nav />

				{(this.state.error === false && this.state.code === false && this.state.readAndWrite === false)? 
					<div>			
						<p>In order to sell tickets you must connect your stripe account to our platform.</p>
						<p>Please click the below button to enable this.</p>
						<p>You will be brought to a Stripe webpage. If you already have a Stripe account, please click 'sign in' in the top right hand corner.</p>
						<p>If you don't have a Stripe account, you can fill in the details on the page to create one, or alternatively, visit <a href='https://dashboard.stripe.com/register' target="_blank" rel="noopener noreferrer">www.stripe.com</a> to create one.</p>

						<a href='https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_GIwo6n5S0Lvl8NZ5RmYGDCSuUvx0OAsM&scope=read_write' className="stripe-connect dark"><span>Connect with Stripe</span></a>
					</div> 
				: <div>{this.state.message}</div>}

			</>

			)
	}
}

export default withRouter(StripeConnectSignUp)
