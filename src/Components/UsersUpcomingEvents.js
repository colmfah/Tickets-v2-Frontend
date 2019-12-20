import React from 'react'
import moment from "moment"
import {Link} from 'react-router-dom'
import axios from "axios"


class UsersUpcomingEvents extends React.Component {

	state = {
		minimumPrice: [],
		waitList :[],
		message: []
	}


componentDidMount(){
	let minimumPrice = this.props.ticketsBought.map(e => e.price)
	let waitList = this.props.ticketsBought.map(e => false)
	let message = this.props.ticketsBought.map(e => '')
	this.setState({minimumPrice, waitList, message})
}

requestRefund = (e, ticketID, i) => {
	e.preventDefault()
	let message = this.state.message
	message[i] = 'Please Wait'
	this.setState({message})
	axios.post(`${process.env.REACT_APP_API}/refundRequest`, {ticketID: ticketID, minimumPrice: this.state.minimumPrice[i], purchaserID: this.props.purchaserID})
		.then(res => {
			let waitList = this.state.waitList
			waitList[i] = res.data.waitList
			let message = this.state.message
			message[i] = res.data.message
			this.setState({message, waitList})
		})
}

handleChange = (event, i) => {
	let minimumPrice= this.state.minimumPrice
	minimumPrice[i] = event.target.value
	if(minimumPrice == 0){
		minimumPrice = 0.01
	}
	this.setState({minimumPrice})
}


	render() {



return (
<>
{this.props.ticketsBought.map((e, i) => {
	return (
		<div key={i}>
		<p>location: {e.userEvent.venue}</p>
		<p>title {e.userEvent.title}</p>
		<p>startDetails
		{moment(e.userEvent.startDetails).format("D MMMM")} {moment(e.userEvent.startDetails).format("HH:mm")}
		</p>
		<p>Ticket type {e.ticketType}</p>
		<p>Purchase Price {e.price}</p>

		<Link
			to={`/qr/${e.userEvent.randomNumber}`}
		>
			<p>Click here to access your QR code to enter the event</p>
		</Link>



		{/*display refund request if refund is part of ticket*/}
		{(e.refunds.optionSelected === 'excessDemand' || (e.refunds.optionSelected === 'untilSpecific' && moment(e.refunds.refundUntil).isAfter(Date.now()))) &&
		<div>
		<button onClick={(event) => this.requestRefund(event, e._id, i)}>Request Refund</button>
		<div>{this.state.message[i]}</div>
		</div>}



		{/*allow customer enter lower bid for refund if backend shows there is a waitlist. Backend will only send this back for tickets where excess demand is selected*/}
	{this.state.waitList[i] === true &&
	<div>
	<p>A limited number of refunds are available for this event. If there is excess demand for refunds, priority will be given to the cheapest refunds. What is the lowest amount you are prepared to accept as a refund?</p>
	<form>
	<input
		value={this.state.minimumPrice[i]}
		required
		onChange={event => this.handleChange(event, i)}
		type='number'
		placeholder='Event Name'
		min={0.00}
		step={0.50}
		max={e.price}
		/>


	<p>Please note that you will usually be refunded higher than the minimum amount. If you choose $5 as the lowest amount you are prepared to accept as a refund but the next lowest refund that a customer has requested is $10, you will be refunded $9.99 - one cent lower than the next lowest request. If there isn't excess demand for refunds you will receive a full refund regardless of the amount you enter here.</p>


	<button onClick={(event) => this.requestRefund(event, e._id, i)}>Submit</button>
		</form>
		</div>
	}
<hr />
		</div>

	)
}
)
}
	</>
)


			}
		}



export default UsersUpcomingEvents
