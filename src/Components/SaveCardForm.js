import React, { Component } from "react";
import {CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";

import "../Styles/Event.css";


class SaveCardForm extends Component {

	// waitListData={this.state.userEvent.tickets.filter(e => e.lastMinuteTicket===true && e.buy.numTicketsSought > 0)}

	// waitListData={{quantity: this.state.userEvent.tickets[this.state.userEvent.tickets.length-1].buy.numTicketsSought,
	// 	maximumPrice: this.state.userEvent.tickets[this.state.userEvent.tickets.length-1].price,
	// 	expires: this.state.userEvent.tickets[this.state.userEvent.tickets.length-1].waitListExpires,
	// 	specificDate: this.state.userEvent.tickets[this.state.userEvent.tickets.length-1].waitListSpecificDate,
	// 	deliverTogether: this.state.userEvent.tickets[this.state.userEvent.tickets.length-1].waitListDeliverTogether
	// }}

	componentDidUpdate(){
		console.log('waitListData', this.props.waitListData)
	}

	state = {
		message: ''
	}

	submit = e => {

		e.preventDefault()

		console.log('this.props', this.props)

		//do if statement ....if there are no requests to purchase last minute tickets (this.props.waitListData will be blank)


			// console.log('this.props.selectedTickets', this.props.selectedTickets)
			// console.log('this.props.checkBoxesAreTicked', this.props.checkBoxesAreTicked)
			// console.log('this.props.checkBoxesAreTicked()', this.props.checkBoxesAreTicked())
			// console.log('this.props.checkBoxesAreTicked(this.props.selectedTickets)', this.props.checkBoxesAreTicked(this.props.selectedTickets))

		if(this.props.checkBoxesAreTicked(this.props.selectedTickets) === false){return}else
		
		{

	
		

		this.props.upDateMessage('This will take a moment. Please be patient...')
		const cardElement = this.props.elements.getElement('card');

		axios.get(`${process.env.REACT_APP_API}/saveCardDetails`).then(res => {
			this.props.upDateMessage('This will take a moment. Please be patient. Verifying credit card...')
			this.props.stripe.confirmCardSetup(
				res.data.client_secret, {
					payment_method: {card: cardElement},
					expand: ['payment_method']		
				}).then( confirmCardSetupRes => {

					console.log('confirmCardSetupRes', confirmCardSetupRes)

					if(confirmCardSetupRes.error){

						this.props.upDateMessage(confirmCardSetupRes.error.message)


					}else if (confirmCardSetupRes.setupIntent.status === 'succeeded'){
						this.props.upDateMessage('This will take a moment. Please be patient. Credit Card Confirmed. Saving Details...')

					
							

							let objectToSend = {
								cardSaved: this.props.cardSaved,
								checkForTickets: {
									userEvent: this.props.userEventID,
									numTicketsSought: this.props.numTicketsSought,
									purchaser: this.props.purchaserID
								},
								paymentMethodID: confirmCardSetupRes.setupIntent.payment_method.id,
								cardDetails: confirmCardSetupRes.setupIntent.payment_method.card,
								replaceExistingCard: this.props.replaceExistingCard,
								stripeData: {
									amount: this.props.total,
									currency: this.props.currency,
										seller: this.props.seller,
										description: this.props.eventTitle,
										moneyForColm: this.props.moneyForColm,
										stripeAccount: this.props.stripeAccountID
									},
								ticketTypesEquivalent: this.props.ticketTypesEquivalent,			
								waitListData: this.props.waitListData
							}

							console.log('object to send', objectToSend);

							axios.post(`${process.env.REACT_APP_API}/paymentIntent`, objectToSend).then(res => {

								console.log('pi res', res);
								

								this.props.upDateMessage(res.data.message)
					
							})

						{/** 

							console.log('going to purchase waitlist');
							

							axios.post(`${process.env.REACT_APP_API}/purchaseWaitList`, {
								waitListData: this.props.waitListData,
								purchaserID: this.props.purchaserID,
								userEventID: this.props.userEventID,
								paymentMethodID: confirmCardSetupRes.setupIntent.payment_method,
								replaceExistingCard: this.props.replaceExistingCard,
								cardSaved: this.props.cardSaved
							}).then(res => {
								this.props.upDateMessage(res.data.message)
							})
						*/}
					


					}else{
						this.this.props.upDateMessage('Error: We were unable to verify your card details. Your bid has not been saved.')
					}

			}).catch(err => console.log('confirmCardSetupRes errrrr', err));
		})

	}

	}

  render() {

    return (
      <div>
			
			<form className="stripe-save-card" onSubmit={this.submit}>
				<CardElement />
				
				<button>
					Get Tickets
				</button>
				<div className="event-message">{this.props.message}</div>
			</form>
			</div>
    );
  }
}

export default injectStripe(SaveCardForm);
