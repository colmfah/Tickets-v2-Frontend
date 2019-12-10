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

      let checkForTicketsObject = {
        userEvent: this.props.userEvent._id,
        numTicketsSought: this.props.numTicketsSought
      }

      axios
        .post(
          `${process.env.REACT_APP_API}/checkForTickets`,
          checkForTicketsObject
        )
        .then(res => {
          this.setState({
            message: res.data.message
          });
          if (!res.data.insufficientTickets) {
            this.setState({
              message: "Processing Payment. Please Wait...."
            })

							let stripeData = {
							  amount: this.props.total,
							  currency: this.props.currency,
								seller: this.props.userEvent.organiser._id,
								description: this.props.eventTitle,
								moneyForColm: this.props.moneyForColm
							}

axios.post(`${process.env.REACT_APP_API}/paymentIntent`, stripeData).then(res => {

{/*console.log('res.data.clientSecret', res.data.clientSecret)

	console.log('res.data.sellersStripeDetails', res.data.sellerStripeAccountID)

var stripe = Stripe(process.env.REACT_APP_API_STRIPE_PUBLISH, { stripeAccount: res.data.sellerStripeAccountID})*/}



		this.props.stripe.handleCardPayment(res.data.clientSecret, {}).then( paymentRes => {
			if(paymentRes.error){
				this.setState({
					message: paymentRes.error.message
				})
			}
			else if(paymentRes.paymentIntent.status === 'succeeded'){




			let createTicketData = {
							purchaser: this.props.purchaser,
							userEvent: this.props.userEvent,
							numTicketsSought: this.props.numTicketsSought
						}

			axios.post(`${process.env.REACT_APP_API}/ticket`, createTicketData)
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




	})

		})

	}})
    }

  }




  render() {
    return (
      <div>
        <p>{this.state.message}</p>
        <CardElement />
        <button onClick={this.submit}>
          Purchase
        </button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
