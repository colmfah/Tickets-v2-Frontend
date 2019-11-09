import React from 'react'
import axios from 'axios'
import moment from "moment"
import {Elements, StripeProvider} from 'react-stripe-elements'
import CheckoutForm from './CheckoutForm'
import Nav from './Nav'
import '../Styles/Stripe.css'
import '../Styles/Event.css'
import eventImage from "../images/eventImage-default.jpg";


class Event extends React.Component {


	state = {
		formFields: [
			{label:'Number of Tickets', type:'number', value:'price'}
		],
		event: {
			_id: '',
			title: '',
			location: '',
			price: 0,
			description: '',
			startDetails: {},
			endDetails: {},
			organiser: {
				_id: '',
				name: ''
			},
			currency: '',
			ticketsRemaining: 0,
			numTicketsSold: 0
		},
		currency: {
			'USD': '$',
			'EUR': '€',
			'NZD': '$'
		},
		numTicketsSought: 1,
		purchaser: '',
		errorMsg:'Does this work',
		total: 20

	}


componentDidMount(){
	axios.get(`${process.env.REACT_APP_API}/events/${this.props.match.params.id}`)
		.then(res => {
			this.setState({
				event: res.data,
			})
		})
		.catch(err => console.log(err))

		if(localStorage.getItem('token')){
			let token = localStorage.getItem('token')
			let objectToSend = {
				token: token
			}
			axios.post(`${process.env.REACT_APP_API}/auth`, objectToSend)
			.then( res => {
				this.setState({
					purchaser: res.data._id
				})
			})
		.catch(err => console.log(err))
		}

}



changeNumTickets = (e) => {

	this.setState({
			numTicketsSought: Number(e.target.value)
		})
}


	render() {

	  return (
			<>

			<div className="backgroundGrid">
	<div
		className="eventImage"
		style={{
			backgroundImage: `url(${eventImage})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
			width: "50vw",
			height: "50vh",
			minmax: "250px auto",
			overflow: "visible"
		}}
	></div>

	<div className="eventInfo">
		<div className="logo-box">
			<i className="fas fa-ticket-alt ticket-logo"></i>
		</div>
		<h3>Organizer Presents:</h3>
		<h1 className="title">Event Name</h1>
		<h3>
			<i
				className="far fa-calendar-check"
				style={{ color: "#EF5A00" }}
			></i>{" "}
			Date:{" "}
		</h3>
		<h3>
			<i className="fas fa-dollar-sign" style={{ color: "#EF5A00" }}>
				{" "}
			</i>{" "}
			Price:{" "}
		</h3>
		<h3>
			<i className="fas fa-map-marker-alt" style={{ color: "#EF5A00" }}>
				{" "}
			</i>{" "}
			Venue:{" "}
		</h3>
		<h3>
			<i className="fas fa-clock" style={{ color: "#EF5A00" }}></i> Doors:{" "}
		</h3>
		<h3>
			<i
				className="fas fa-map-marker-alt"
				style={{ color: "#EF5A00" }}
			></i>
			{"  "}City:{" "}
		</h3>
	</div>
	<div className="description">
		<p>
			<h3> Description: </h3>
			Description about event Description about event Description about
			event Description about event Description about event Description
			about event Description about event Description about event
			Description about event Description about event Description about
			event Description about event Description about event{" "}
		</p>
	</div>

	<button className="eventButton" onClick="/CheckoutForm">
		Purchase tickets
	</button>

	<Nav />
</div>



			{/*<Nav />

			<div>{this.state.event.title} </div>
			<div>{this.state.event.description} </div>
			<div>{this.state.event.location} </div>
			<div>Starts: {moment(this.state.event.startDetails).format('D MMMM YYYY HH:mm')} </div>
			<div>Ends: {moment(this.state.event.endDetails).format('D MMMM YYYY HH:mm')} </div>
			<div>{this.state.currency[this.state.event.currency]}{this.state.event.price} {this.state.event.currency}  </div>
			<div>Organiser: {this.state.event.organiser.name}</div>


			<form onSubmit={this.buyTickets}>
				{this.state.formFields.map((e,i) =>
						<div key={i}>
							<label>{e.label}</label>
							<input
								value={this.state.numTicketsSought}
								required
								onChange={this.changeNumTickets}
								type={e.type}
								min={1}
								max={this.state.event.ticketsRemaining<10 ? this.state.event.ticketsRemaining : 10}
								/>
						</div>
					)
				}
			</form>

			<div>Price: {this.state.numTicketsSought * this.state.event.price}</div>
			<div>Admin Fee: {(0.69 + (.055*this.state.numTicketsSought * this.state.event.price)).toFixed(2)}</div>
			<div>Total :{((this.state.numTicketsSought * this.state.event.price) + 0.69 + (.055*this.state.numTicketsSought * this.state.event.price)).toFixed(2)}</div>

			<p>{this.state.errorMsg}</p>


			<StripeProvider apiKey='pk_test_RFZrPP1Ez6Bq8WArOADRk3gy0070dfs07P'>
				<div>
					<Elements>
						<CheckoutForm
							total={((this.state.numTicketsSought * this.state.event.price) + 0.69 + (.055*this.state.numTicketsSought * this.state.event.price))}
							currency={this.state.event.currency}
							description={this.state.event.title}
							purchaser = {this.state.purchaser}
							event = {this.state.event._id}
							numTicketsSought = {this.state.numTicketsSought}
						/>
					</Elements>
				</div>
			</StripeProvider>*/}



			</>
		)
}
}

export default Event
