import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";
import { Link } from "react-router-dom";

class CheckoutForm extends Component {

  state = {
    creditCardEmpty: true,
    creditCardComplete: false,
    creditCardError: false,
    creditCardErrorMessage: '',
    disablePurchaseButton: false,
  };


  buttonText = () => {
    if(this.props.userEvent.tickets.filter(e=>e.lastMinuteTicket).length > 0){return `Reserve Tickets`}
    return `Purchase Tickets`
  }

  chargeCardLater = async (tickets) => {
    if(tickets.filter(ticket => ticket.lastMinuteTicket).length === 0){return}
    let error = false
    this.props.clearMessage()
    this.toggleDisablePurchaseButton()
    this.props.updateMessage("Saving your card. Please Wait")
    let clientSecret = await axios.post(`${process.env.REACT_APP_API}/saveNewCard`, {purchaserEmail: this.props.purchaserEmail, userEvent: this.props.userEvent}).catch(err =>{error = true; this.handlePaymentError(err) })
    if(error){return}
    this.props.updateMessage(`This will take a minute. Please be patient`)
    const cardElement = this.props.elements.getElement("card");
    let confirmCardData = await this.props.stripe.confirmCardSetup(clientSecret.data.clientSecret, {payment_method: {card: cardElement, billing_details: {email: this.props.purchaserEmail}}}).catch(err =>{error = true; this.handlePaymentError(err) })
    if (confirmCardData.error) { error=true; this.handlePaymentError(confirmCardData.error) } 
    if(error){return}
    this.props.updateMessage(`Card Details Validated. Saving Card. Please Wait`)
    this.props.toggleRefundStatusDisplay()
    let createdWaitList = await axios.post(`${process.env.REACT_APP_API}/purchaseWaitList`, {
      purchaserEmail: this.props.purchaserEmail,
      userEvent: this.props.userEvent,
      waitLists: tickets,
      paymentMethod: confirmCardData.setupIntent.payment_method,
      promotionalMaterial: this.props.promotionalMaterial
    })
    .catch(err =>{error = true; this.handlePaymentError(err) })
    if(error){return}
    this.props.updateMessage(createdWaitList.data.response.message)
    this.toggleDisablePurchaseButton()
    if(createdWaitList.data.response.success){
      this.props.changeMessageColor('green')
      this.props.resetTicketQuantities()
      return
    }
    this.props.changeMessageColor('red')
  }

  checkCreditCardNumber = (event) => {
    this.props.clearMessage()
    let creditCardError = event.error !== undefined
    let creditCardEmpty = event.empty
    let creditCardComplete = event.complete
    let creditCardErrorMessage
    creditCardError ? creditCardErrorMessage = event.error.message : creditCardErrorMessage = ''    
    this.setState({creditCardError, creditCardEmpty, creditCardComplete, creditCardErrorMessage })
  }

  compilePaymentDetails = (paymentMethodID='') => {
    return {
      userEvent: this.props.userEvent,
      requestedTickets: this.props.requestedTickets,
      purchaserEmail: this.props.purchaserEmail,
      amount: this.props.total,
      paymentMethodID: paymentMethodID,
      promotionalMaterial: this.props.promotionalMaterial
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
    this.chargeCardLater(this.props.tickets)
    this.payNow(this.props.tickets)
  }

  getDataToEmailTickets = (paymentIntent) => {
    return {
      paymentIntentID: paymentIntent.paymentIntent.id,
      userEvent: this.props.userEvent._id,
      emailAddressFromFrontEnd: this.props.purchaserEmail
    }
  }

  handlePaymentError = (err, frontEndError = false, clientSecret=null) => {
    this.hideRefundStatus() 
    this.props.changeMessageColor('red')
    console.log('typeof(err)', typeof(err))
    typeof(err) === 'object' ? this.props.updateMessage(err.message) : this.props.updateMessage(String(err))
    this.toggleDisablePurchaseButton()
    if(!frontEndError){return}
    this.updateTicketsWithError(err, clientSecret)
  }

  hideRefundStatus = () => {
    let displayRefundStatus = false
    this.setState({displayRefundStatus})

  }

  isUserLoggedIn = () => {
    let token = localStorage.getItem("token");
    if (token) {return true} 
    return false; 
  }

  payNow = async (tickets) => {
    if(tickets.filter(ticket => ticket.lastMinuteTicket).length > 0){return}
    let error = false
    this.props.clearMessage()
    this.toggleDisablePurchaseButton()
    this.props.updateMessage("Checking for tickets. Please Wait")
    let clientSecret = await axios.post(`${process.env.REACT_APP_API}/paymentsSetup`, this.compilePaymentDetails()).catch(err =>{error = true; this.handlePaymentError(err) })
    if(error){return}
    if (!clientSecret.data.success) {error = true; this.handlePaymentError(clientSecret.data.message)} 
    if(error){return}
    this.props.updateMessage("Processing Card Details. This will take a minute. Please be patient")
    const cardElement = this.props.elements.getElement("card");
    let confirmedCardData = await this.props.stripe.confirmCardSetup(clientSecret.data.clientSecret, {payment_method: {card: cardElement, billing_details: {email: this.props.purchaserEmail}}}).catch(err =>{ error = true; this.handlePaymentError(err, true, clientSecret)})
    if(error){return}
    if (confirmedCardData.error) {  error = true; this.handlePaymentError(confirmedCardData.error.message, true, clientSecret)} 
    if(error){return}
    this.props.updateMessage("Confirmed Card Details. Charging Card. Please Wait")
    this.props.toggleRefundStatusDisplay()
    let chargedCard = await axios.post(`${process.env.REACT_APP_API}/payNow`, this.compilePaymentDetails(confirmedCardData.setupIntent.payment_method)).catch(err =>{error = true; this.handlePaymentError(err) })
    if(error){return}
    if(!chargedCard.data.success){error = true; this.handlePaymentError(chargedCard.data.message)}
    if(error){return}
    axios.post(`${process.env.REACT_APP_API}/emailTickets`,{paymentIntent: chargedCard.data.paymentIntent, userEvent: this.props.userEvent}).then(res=>{})
    this.props.changeMessageColor('green')
    this.props.updateMessage(`Your card has been charged. Your tickets will be emailed to ${this.props.purchaserEmail} shortly`)
    this.props.resetTicketQuantities()
    this.toggleDisablePurchaseButton()
  }

  refundStatusClass = () => {
    if(this.props.displayRefundStatus && this.props.tickets.length === 0){return `refund-status-message`}
    if(this.props.displayRefundStatus && this.props.tickets[0].lastMinuteTicket){return `refund-status-message`}
    if(this.props.displayRefundStatus){return `refund-status-message reveal`}
    return `display-none`
  }

  toggleDisablePurchaseButton = () => {
    let disablePurchaseButton = !this.state.disablePurchaseButton
    this.setState({ disablePurchaseButton })
  }

  updateTicketsWithError = async (err, clientSecret) => {
    console.log('updateTicketsWithError')
    await axios.post(`${process.env.REACT_APP_API}/frontEndPaymentError`, {error: String(err), tickets: clientSecret.data.tickets})
  }


  render() {
    let {changeEmail, message, messageColor, purchaserEmail} = this.props
    return (
      <form onSubmit={e => this.decideTransactionType(e)}>
        <input type="email" placeholder="Your Email Address" name="email"
          required
          value={purchaserEmail}
          disabled = {this.isUserLoggedIn()}
          onChange={event => changeEmail(event)}
          className={'match-stripe'}
          autoComplete={'on'}
        />
        <CardElement onChange={event => this.checkCreditCardNumber(event)}/>
        <div id='message-and-purchase-button'>
          <div className ={this.state.disablePurchaseButton ? 'lds-default': 'display-none'}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          <div className='purchase-message' style={{color: messageColor}}>{message}</div>
          <div className={this.refundStatusClass() }>
            A limited number of refunds are available for this event <br /> 
            Visit the <Link to={`/tickets`} target="_blank" rel="noopener noreferrer">tickets section</Link> of <em>My Account</em> to request a refund
          </div>
          <button id={this.state.disablePurchaseButton ?  'disable-purchase-button': 'purchase-button'} disabled={this.state.disablePurchaseButton}>
            {this.buttonText()}
          </button>
        </div>
      </form>
      
    )
  }
}

export default injectStripe(CheckoutForm);

