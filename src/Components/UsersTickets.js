import React from 'react'
import moment from "moment"
import {Link} from 'react-router-dom'
import axios from "axios"


class UsersTickets extends React.Component {

	state = {
		minimumPrice: [],
		refundRequestsExist :[],
		customersWaitingToBuy: [],
		message: []
	}


componentDidMount(){
	let minimumPrice = this.props.ticketsBought.map(e => e.purchasersMinimumPrice)
	let refundRequestsExist = this.props.ticketsBought.map(e => e.refundRequestsExist)
	let customersWaitingToBuy = this.props.ticketsBought.map(e => e.customersWaitingToBuy)
	let message = this.props.ticketsBought.map(e => '')
	this.setState({minimumPrice, refundRequestsExist, customersWaitingToBuy, message})
}

requestRefund = (e, ticketID, i) => {
	e.preventDefault()
	let message = this.state.message
	message[i] = 'Please Wait...'
	this.setState({message})
	axios.post(`${process.env.REACT_APP_API}/refundRequest`, {ticketID: ticketID, minimumPrice: this.state.minimumPrice[i], purchaserID: this.props.purchaserID, token: localStorage.getItem("token")})
		.then(res => {
			console.log('res.data', res.data)
			message[i] = res.data.message
			this.setState({message})
			if(res.data.user){
						this.props.updateState(res.data.user)
			}

		})
}

handleChange = (event, i) => {
	let minimumPrice= this.state.minimumPrice
	minimumPrice[i] = event.target.value
	if(minimumPrice === 0){
		minimumPrice = 0.01
	}
	this.setState({minimumPrice})
}

cancelRefundRequest = (e, ticketID, i) => {
	e.preventDefault()
	let message = this.state.message
	message[i] = 'Please Wait...'
	this.setState({message})

	let objectToSend = {
		token: localStorage.getItem("token"),
		ticketID: ticketID
	}

	axios.post(`${process.env.REACT_APP_API}/cancelRefundRequest`, objectToSend).then(res => {
		let message = this.state.message
		message[i] = res.data.message
		this.setState({message})
		this.props.updateState(res.data.user)

	}).catch(err => console.log(err))

}


	render() {



return (
<>
{this.props.ticketsBought.map((e, i) => {
	return (
		<div key={i}>
		<div>Ticket: {i+1}</div>
		<div>{e._id}</div>
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

		<p>Refund Policy: {e.refunds.optionSelected}</p>
		<p>How To ReSell: {e.refunds.howToResell}</p>



		{/*display refund request if refund is part of ticket*/}
		{(e.refunds.optionSelected === 'excessDemand' || e.refunds.optionSelected === 'excessDemandTicketType' || (e.refunds.optionSelected === 'untilSpecific' && moment(e.refunds.refundUntil).isAfter(Date.now()))) &&
		<div>

		{(e.refundRequested === true) &&
		<div>
		<p>Your request for a refund of {e.purchasersMinimumPrice} has been registered</p>
		</div>}


		{e.refundRequested === true ? <div><button onClick={(event) => this.cancelRefundRequest(event, e._id, i)}>Cancel Refund Request</button></div> : <div><button onClick={(event) => this.requestRefund(event, e._id, i)}>Request Refund</button></div>}



		<div>{this.state.message[i]}</div>
		</div>}



		{/*allow customer enter lower bid for refund if backend shows there is a waitlist. Backend will only send this back for tickets where excess demand is selected*/}
	{(e.refundRequested === true) &&
	<div>
	<p>There is excess demand for refunds for this ticket. Priority will be given to tickets with the lowest cost to refund.</p> <p>What is the lowest amount you are prepared to accept as a refund?</p>
	<form>
	<input
		value={this.state.minimumPrice[i]}
		required
		onChange={event => this.handleChange(event, i)}
		type='number'
		placeholder='Event Name'
		min={0.00}
		max={e.price}
		/>
<br />
	<button onClick={(event) => this.requestRefund(event, e._id, i)}>Update Refund Request</button>

{(e.userEvent.latestRefundPrice === 0) ?<p>The next ticket scheduled to be refunded will receive a refund of {e.userEvent.nextRefundPrice} </p> :<p>The last ticket to be refunded was refunded for {e.userEvent.latestRefundPrice} </p> }


	<p>You will usually be refunded higher than the minimum amount. If you choose $5 as the lowest amount you are prepared to accept as a refund but the next lowest refund that a customer has requested is $10, you will be refunded $9.99 - one cent lower than the next lowest request.</p>



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


export default UsersTickets
