import React from 'react'
import moment from "moment"
import {Link} from 'react-router-dom'
import axios from "axios"


class UsersUpcomingEvents extends React.Component {

	state = {
		minimumPrice: []
	}


componentDidMount(){
	let minimumPrice = this.props.ticketsBought.map(e => e.price)
	this.setState({minimumPrice})
}

requestRefund = (e, ticketID, i) => {
	e.preventDefault()
	console.log('request refund triggered')
	axios.post(`${process.env.REACT_APP_API}/refundRequest`, {ticketID: ticketID, minimumPrice: this.state.minimumPrice[i], purchaserID: this.props.purchaserID})
		.then()
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



		{(e.refunds.optionSelected === 'excessDemand' || (e.refunds.optionSelected === 'untilSpecific' && moment(e.refunds.refundUntil).isAfter(Date.now()))) &&
		<form>
		<h3>Request Refund</h3>
		<p>A limited number of refunds are available for this event. If there is excess demand for refunds, priority will be given to the cheapest refunds. What is the lowest amount you are prepared to accept as a refund?</p>

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
	 }


			<hr />
		</div>
				);
			})}

			</>
		)
}
}

export default UsersUpcomingEvents
