import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";

class CheckoutForm extends Component {

  state = {
    creditCardEmpty: true,
    creditCardComplete: false,
    creditCardError: false,
    creditCardErrorMessage: '',
    disablePurchaseButton: false
  };

  isUserLoggedIn = () => {
    let token = localStorage.getItem("token");
    if (token) {
      return true;
    } else {
      return false;
    }
  };

  chargeCardNow = async (tickets) => {
    if(tickets.filter(ticket => !ticket.lastMinuteTicket).length === 0){return}
    this.props.clearMessage()
    this.toggleDisablePurchaseButton()
    let message = "Checking for tickets. Please Wait..."
    this.props.updateMessage(message)
    this.getClientSecret() 
  };

  checkCreditCardNumber = (event) => {
    this.props.clearMessage()
    let creditCardError = event.error !== undefined
    let creditCardEmpty = event.empty
    let creditCardComplete = event.complete
    let creditCardErrorMessage
    creditCardError ? creditCardErrorMessage = event.error.message : creditCardErrorMessage = ''    
    this.setState({creditCardError, creditCardEmpty, creditCardComplete, creditCardErrorMessage })
  }

  compilePaymentDetails = () => {
    return {
      userEvent: this.props.userEvent._id,
      requestedTickets: this.props.requestedTickets,
      purchaserEmail: this.props.purchaserEmail,
      stripeData: {
        amount: this.props.total,
        currency: this.props.userEvent.currency,
        seller: this.props.userEvent.organiser._id,
        description: this.props.userEvent.title,
      }
    };
  }

  compilePaymentMethod = () => {
    return{
      payment_method: {
        card: this.props.elements.getElement("card"),
        billing_details: {email: this.props.purchaserEmail},
      },
    };
  }

  creditCardErrorsExist  = () => {
    if(this.state.creditCardEmpty){
      this.props.updateMessage('Please enter a credit card number')
      this.props.changeMessageColor('red')
      return true
    }
    if(!this.state.creditCardComplete){
      this.props.updateMessage('Please enter a valid credit card number')
      this.props.changeMessageColor('red')
      return true
    }
    if(this.state.creditCardError){
      this.props.updateMessage(this.state.creditCardErrorMessage)
      this.props.changeMessageColor('red')
    }
    return false
  }

  decideTransactionType = (event) => {
    event.preventDefault()
    if(this.creditCardErrorsExist()){return}
    if (this.props.purchaseErrorsExist()) {return}  
    this.saveCard(this.props.tickets)
    this.chargeCardNow(this.props.tickets)
  }

  handleClientSecretError = (clientSecretResponse) => {
    this.props.updateMessage(clientSecretResponse.data.message)
    this.props.changeMessageColor('red')
    this.toggleDisablePurchaseButton()
  }

  handleEmailTicketsFailure = (backEndResponse, attempts) => {
    this.props.updateMessage(backEndResponse)
    this.props.changeMessageColor('red')
    if(attempts >= 5){
    // let message = "Your payment was successful but there was a difficulty emailing your tickets. Please log into your account to access the QR code you require to attend this event"
    this.props.updateMessage(backEndResponse)
    this.props.changeMessageColor('red')
    this.toggleDisablePurchaseButton ()
    return
    //change quantities of tickets back to zero here so that user doesn't accidentally repurchase.
    }

  }
  
  handlePaymentIntentError = (paymentIntent) => {
    this.props.updateMessage(paymentIntent.error.message)
    this.props.changeMessageColor('red')
    this.toggleDisablePurchaseButton()

    let dataForBackEnd = {
      userEvent: this.props.userEvent._id,
      paymentIntentID: paymentIntent.error.payment_intent.id
    }  
        
    axios.post(`${process.env.REACT_APP_API}/deleteTempTickets`, dataForBackEnd)
    .catch(err => console.log('deleteTempTicketserr', err)) //need to rename func if using in two places
    return
  }

  emailTickets = async (paymentIntent, attempts) => {
    let promiseError = false
    axios.post(`${process.env.REACT_APP_API}/emailTickets`,this.getDataToEmailTickets(paymentIntent))
    .catch(error => {
      attempts++
      promiseError = true      
      if(attempts >= 5){
        let message = `ACTION REQUIRED: Your card has been charged but your tickets have not been emailed. Please contact us quoting the following error: ${error.message}, ${paymentIntent.paymentIntent.id}. We need this exact code to locate your tickets`
        this.handleEmailTicketsFailure(message, attempts)
        return
      }else if(attempts > 0){
        let delay = 1000 * attempts
        if(attempts === 4){ delay = 1000}
        let message = `Please be patient. Your card has been charged but we have not been able to create your tickets. We are resolving the problem. This will take a few minutes. Do not close this window`
        this.props.updateMessage(message)
        setTimeout(() => {
          this.emailTickets(paymentIntent, attempts)
        }, delay);
        //what when it fails 5 times?
      }
    })
    .then(backEndResponse => {
    if(promiseError){return }//deal with error
    if(!backEndResponse.data.success){
      this.handleEmailTicketsFailure(backEndResponse.data.message, 1)
      return
    }
    let message = `Payment Successful. Your tickets will be emailed to ${this.props.purchaserEmail} shortly`
    this.props.changeMessageColor('green')
    this.props.updateMessage(message)
    this.resetTicketQuantities()
    this.toggleDisablePurchaseButton ()
  })
  }

  getClientSecret = () => {
    axios.post(`${process.env.REACT_APP_API}/payments`, this.compilePaymentDetails())
    .then(clientSecretResponse => {
      if (!clientSecretResponse.data.success){
        this.handleClientSecretError(clientSecretResponse)
        return
      }
      console.log('clientSecretResponse', clientSecretResponse)
      this.props.updateMessage(clientSecretResponse.data.message)
      this.getPaymentIntent(clientSecretResponse)
    }).catch(err => {
      this.props.updateMessage(err.message)
      this.props.changeMessageColor('red')
      this.toggleDisablePurchaseButton()
    })
  }

  getPaymentIntent = (clientSecretResponse) => {
    this.props.stripe
    .confirmCardPayment(
      clientSecretResponse.data.clientSecret, this.compilePaymentMethod()
    ).then(paymentIntent => {
        if (paymentIntent.error || paymentIntent.paymentIntent.status !== "succeeded") {
          this.handlePaymentIntentError(paymentIntent) 
          return
        }   
        console.log('paymentIntent', paymentIntent)
        this.emailTickets(paymentIntent, 0)
        let message = `Please Wait. Payment Successful. Creating Your Tickets...`
        this.props.updateMessage(message)
      }).catch(err => {
        this.handlePaymentIntentError(err)
        this.props.updateMessage(err.message)
        this.props.changeMessageColor('red')
      })
  }

  getDataToEmailTickets = (paymentIntent) => {
    return {
      paymentIntentID: paymentIntent.paymentIntent.id,
      userEvent: this.props.userEvent._id,
      emailAddressFromFrontEnd: this.props.purchaserEmail
    }
  }

  toggleDisablePurchaseButton = () => {
    let disablePurchaseButton = !this.state.disablePurchaseButton
    this.setState({ disablePurchaseButton })
  }

  resetTicketQuantities = () => {
    this.props.tickets.forEach((ticket, index) => {
      this.props.changeQuantity(index, 0, false)
    })
  }

  saveCard = async (tickets) => {
    if(tickets.filter(ticket => ticket.lastMinuteTicket).length === 0){return}
    this.props.clearMessage()
    this.toggleDisablePurchaseButton()

    let message = "Saving your card. Please Wait"
    this.props.updateMessage(message)
  
    let clientSecret = await axios.post(`${process.env.REACT_APP_API}/saveNewCard`, {
      purchaserEmail: this.props.purchaserEmail,
      userEvent: this.props.userEvent._id
    }).catch(err =>{ 
      this.props.changeMessageColor('red')
      this.props.updateMessage(String(err))
    })

    message = "This will take a minute. Please be patient"
    this.props.updateMessage(message)
    let stripeCustomerID = clientSecret.data.customerID
    const cardElement = this.props.elements.getElement("card");
    let confirmCardData = await this.props.stripe.confirmCardSetup(clientSecret.data.clientSecret, {
      payment_method: {card: cardElement, billing_details: {email: this.props.purchaserEmail}},
    }).catch(err =>{ 
      this.props.changeMessageColor('red')
      this.props.updateMessage(String(err))
    })

    console.log('confirmCardData', confirmCardData)

    if (confirmCardData.error) {
      this.props.changeMessageColor('red')
      this.props.updateMessage(String(confirmCardData.error))
      return
    } 

    message = "Card Details Validated. Saving Card. Please Wait...";
    this.props.updateMessage(message)

    await axios.post(`${process.env.REACT_APP_API}/purchaseWaitList`, {
      purchaserEmail: this.props.purchaserEmail,
      userEventID: this.props.userEvent._id,
      tickets: tickets,
      paymentMethod: confirmCardData.setupIntent.payment_method,
      stripeCustomerID: stripeCustomerID
    }).catch(err =>{ 
      this.props.changeMessageColor('red')
      this.props.updateMessage(String(err))
    })

    message = "You card has been saved. You will receive an email if you secure tickets."
    this.props.changeMessageColor('green')
    this.props.updateMessage(message)
    this.resetTicketQuantities()
    this.toggleDisablePurchaseButton()
    
  }

  buttonText = () => {
    if(this.props.userEvent.tickets.filter(e=>e.lastMinuteTicket)){return `Reserve Tickets`}
    return `Purchase Tickets`
  }



  render() {
    let {changeEmail, message, messageColor, purchaserEmail} = this.props
 
    return (
      <form onSubmit={(e) => this.decideTransactionType(e)}>
            <input type="email" placeholder="Email Address" 
              required
              value={purchaserEmail}
              disabled = {this.isUserLoggedIn()}
              onChange={event => changeEmail(event)}
              className={'match-stripe'}
            />
            <CardElement
              onChange={event => this.checkCreditCardNumber(event)}
            />
            <div id='message-and-purchase-button'>

              <div className ={this.state.disablePurchaseButton ? 'lds-default': 'display-none'}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              <div className='purchase-message' style={{color: messageColor}}>{message}</div>


              <button id={this.state.disablePurchaseButton ?  'disable-purchase-button': 'purchase-button'} disabled={this.state.disablePurchaseButton}>
                {this.buttonText()}
              </button>
            </div>
      </form>
    )
  }
}

export default injectStripe(CheckoutForm);



// sendPaymentIntent = (props, chargeSavedCardNow) => {
  //   this.setState({ message: "Checking for tickets. Please Wait..." });

  //   let objectToSend = {
  //     ticketTypesEquivalent: props.ticketTypesEquivalent,
  //     saveCard: props.saveCard,
  //     // paymentMethodID: paymentMethodID,
  //     chargeSavedCardNow: chargeSavedCardNow,

  //     checkForTickets: {
  //       userEvent: props.userEvent._id,
  //       numTicketsSought: props.numTicketsSought,
  //       purchaser: props.purchaser,
  //     },
  //     stripeData: {
  //       amount: props.total,
  //       currency: props.currency,
  //       seller: props.userEvent.organiser._id,
  //       description: props.eventTitle,
  //       moneyForColm: props.moneyForColm,
  //     },
  //   };

  //   axios
  //     .post(`${process.env.REACT_APP_API}/payments`, objectToSend)
  //     .then((res) => {
  //       if (res.data.chargeCardNow.success) {
  //         //how do I code if free tickets (no hold) are mixed in with these tickets. When does the res.data for free tickets display?

  //         this.setState({ message: res.data.chargeCardNow.message });

  //         const cardElement = props.elements.getElement("card");

  //         let paymentMethod = {
  //           payment_method: {
  //             card: cardElement,
  //           },
  //         };

  //         props.stripe
  //           .confirmCardPayment(res.data.clientSecret, paymentMethod)

  //           .then((paymentRes => {
  //             if (paymentRes.error) {
  //               this.setState({ message: paymentRes.error.message });
  //               axios.post(`${process.env.REACT_APP_API}/deleteTempTickets`, {
  //                 tickets: res.data.tickets,
  //                 refunds: res.data.refundRequests,
  //                 ticketsAlreadyRefunded: res.data.ticketsAlreadyRefunded,
  //               }); //amend to include overdue refunds
  //               //i've never tested this. also need to include it anywhere else payment might fail

  //               {
  //                 /*Secuirty Issue: There is a window here for hacker to manually post the tickets to backend to make them valid using updateTicketData controller*/
  //                 // Can I overcome this by using some id from payment Res?
  //               }
  //             } else if (paymentRes.paymentIntent.status === "succeeded") {
  //               let updateTicketData = {
  //                 purchaser: props.purchaser,
  //                 tickets: res.data.tickets,
  //                 ticketsAlreadyRefunded: res.data.ticketsAlreadyRefunded,
  //                 refundRequests: res.data.refundRequests,
  //                 paymentIntentID: paymentRes.paymentIntent.id,
  //                 userEvent: props.userEvent._id,
  //               };

  //               axios
  //                 .post(
  //                   `${process.env.REACT_APP_API}/emailTickets`,
  //                   updateTicketData
  //                 )
  //                 .then((res) => {
  //                   this.setState({ message: res.data.message });
  //                 })
  //                 .catch((err) => console.log("create tickets err", err));
  //             } else {
  //               this.setState({
  //                 message: "Payment Failed. You have not been charged",
  //               });
  //               console.log("payment failed", paymentRes);
  //             }
  //           })
  //           .catch((err) => console.log("handleCardPaymentErr", err));
  //       }

  //       let overall = this.state.overall;
  //       overall.message = res.data.overall.message;
  //       overall.success = res.data.overall.success;

  //       this.setState({ overall });
  //     });
  // };










// else if (this.props.chargeSavedCard) {
//   let chargeSavedCardNowDetails = this.state.chargeSavedCardNowDetails;
//   chargeSavedCardNowDetails.message = "Charging Card. Please Wait...";

//   this.setState({ chargeSavedCardNowDetails });

//   let chargeSavedCardNow = true;

//   this.sendPaymentIntent(this.props, chargeSavedCardNow);
// }


