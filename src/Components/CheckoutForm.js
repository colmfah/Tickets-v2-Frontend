import React, { Component } from "react";
import { Stripe, CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  state = {
    message: "Would you like to complete the purchase?"
  }


  submit = e => {
    e.preventDefault();
    if (this.props.purchaser === "") {
      this.setState({
        message: "You must log in to purchase tickets"
      })
    } else {
      this.setState({
        message: `Checking if tickets are still available`
      })
			let objectToSend = {}
      objectToSend.checkForTickets = {
        userEvent: this.props.userEvent._id,
        numTicketsSought: this.props.numTicketsSought,
				purchaser: this.props.purchaser
      }


	this.setState({message: "Checking for tickets. Please Wait..."})
	objectToSend.stripeData = {
	  amount: this.props.total,
	  currency: this.props.currency,
		seller: this.props.userEvent.organiser._id,
		description: this.props.eventTitle,
		moneyForColm: this.props.moneyForColm
	}




axios.post(`${process.env.REACT_APP_API}/paymentIntent`, objectToSend).then(res => {
	console.log('res from payment intent arrived on frontend', res)
	this.setState({message: res.data.message})

	if (res.data.success){
		this.props.stripe.handleCardPayment(res.data.clientSecret, {}).then( paymentRes => {
			console.log('paymentRes', paymentRes)
			if(paymentRes.error){
				this.setState({message: paymentRes.error.message})
axios.post(`${process.env.REACT_APP_API}/deleteTempTickets`, res.data.tickets)
//i've never tested this. also need to include it anywhere else payment might fail

{/*Secuirty Issue: There is a window here for hacker to manually post the tickets to backend to make them valid using updateTicketData controller*/}

			}
			else if(paymentRes.paymentIntent.status === 'succeeded'){
			console.log('updating tickets section')

			let updateTicketData = {
							purchaser: this.props.purchaser,
							tickets: res.data.tickets,
							paymentIntentID: paymentRes.paymentIntent.id,
							userEvent: this.props.userEvent._id,
						}


if (res.data.refundsRequested == true){
	console.log('condition triggered')
	updateTicketData.refundRequests = res.data.refundRequests
}

console.log('updateTicketData', updateTicketData)



			axios.post(`${process.env.REACT_APP_API}/emailTickets`, updateTicketData)
			.then(res => {this.setState({
					message:"Payment Successful. Your tickets will be emailed to you shortly"
						})
					}).catch(err => console.log('create tickets err', err))


		} else {
			this.setState({
				message: "Payment Failed. You have not been charged"
			})
			console.log('payment failed', paymentRes)
		}

	}).catch(err => console.log('handleCardPaymentErr', err))
	}
		})
    }
  }

  render() {

    return (
      <div>
        <p>{this.state.message}</p>
        <CardElement />
        <button onClick={this.submit}>
          Purchase Tickets
        </button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
