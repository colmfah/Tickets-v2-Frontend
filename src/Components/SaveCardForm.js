import React, { Component } from "react";
import { Stripe, CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";


class SaveCardForm extends Component {








  submit = e => {
    e.preventDefault();
		const cardElement = this.props.elements.getElement('card');
		console.log('cardElement', cardElement)

		axios.get(`${process.env.REACT_APP_API}/saveCardDetails`).then(res => {
		console.log('res.data', res.data)
		this.props.stripe.confirmCardSetup(res.data.client_secret, {
			payment_method: {
        card: cardElement,
      },
		}
    ).then( confirmCardSetupRes => {
			console.log('confirmCardSetupRes', confirmCardSetupRes)
  }).catch(err => console.log('some errrrr', err));
})

}






  render() {

    return (
      <div>
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



{/*this.props.stripe.confirmCardSetup('{PAYMENT_INTENT_CLIENT_SECRET}', {
payment_method: {
card: cardElement,
},
})*/}
