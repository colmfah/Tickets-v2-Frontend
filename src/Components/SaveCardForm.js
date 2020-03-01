import React, { Component } from "react";
import { Stripe, CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";


class SaveCardForm extends Component {

	componentDidUpdate(){

	}





state = {
	message: ''
}
  submit = e => {
    e.preventDefault();
		this.props.upDateMessage('This will take a moment. Please be patient...')
		const cardElement = this.props.elements.getElement('card');

		axios.get(`${process.env.REACT_APP_API}/saveCardDetails`)
		.then(res => {
		this.props.upDateMessage('This will take a moment. Please be patient. Verifying credit card...')

		this.props.stripe.confirmCardSetup(res.data.client_secret, {
			payment_method: {
        card: cardElement,
      }
		}
    )

		.then( confirmCardSetupRes => {

			if (confirmCardSetupRes.setupIntent.status === 'succeeded'){
				this.props.upDateMessage('This will take a moment. Please be patient. Credit Card Confirmed. Saving Details...')

		axios.post(`${process.env.REACT_APP_API}/purchaseWaitList`, {
				waitListData: this.props.waitListData,
				purchaserID: this.props.purchaserID,
				userEventID: this.props.userEventID,
				paymentMethodID: confirmCardSetupRes.setupIntent.payment_method,
				replaceExistingCard: this.props.replaceExistingCard
			}).then(res => {
				this.props.upDateMessage(res.data.message)
			})

			}else{
				this.this.props.upDateMessage('Error: We were unable to verify your card details. Your bid has not been saved.')
			}

  }).catch(err => console.log('confirmCardSetupRes errrrr', err));
})

}

  render() {

    return (
      <div>
			<p>{this.props.message}</p>
			<form onSubmit={this.submit}>
				<CardElement />
				<button>
					Bid For Tickets
				</button>
			</form>
			</div>
    );
  }
}

export default injectStripe(SaveCardForm);
