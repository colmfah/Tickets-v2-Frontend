import React, { Component } from "react";
import { Stripe, CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";


class SaveCardForm extends Component {


state = {
	message: ''
}



  submit = e => {
    e.preventDefault();
		this.setState({message:'This will take a moment. Please be patient...'})
		const cardElement = this.props.elements.getElement('card');
		axios.get(`${process.env.REACT_APP_API}/saveCardDetails`).then(res => {
		this.setState({message:'This will take a moment. Please be patient. Verifying credit card...'})
		this.props.stripe.confirmCardSetup(res.data.client_secret, {
			payment_method: {
        card: cardElement,
      },
		}
    ).then( confirmCardSetupRes => {
			if (confirmCardSetupRes.setupIntent.status === 'succeeded'){
				this.setState({message:'This will take a moment. Please be patient. Credit Card Confirmed. Saving Details...'})



		axios.post(`${process.env.REACT_APP_API}/purchaseWaitList`, {
				waitListData: this.props.waitListData,
				purchaserID: this.props.purchaserID,
				userEventID: this.props.userEventID,
				paymentMethodID: confirmCardSetupRes.setupIntent.payment_method
			}).then(res => {console.log('waitListRes', res)})

			}else{
				// display error message
			}

  }).catch(err => console.log('confirmCardSetupRes errrrr', err));
})

}






  render() {

    return (
      <div>
			<p>{this.state.message}</p>
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
