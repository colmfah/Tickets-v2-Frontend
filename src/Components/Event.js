import React from "react";
import axios from "axios";
import moment from "moment";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import Nav from "./Nav";
import ColmTicket from "./ColmTicket";
import Footer from "./Footer";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarker,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "../Styles/Event.css";
import "../Styles/DatePickerEdits.css";
import "../Styles/Global.css";

class Event extends React.Component {


  state = {
    formFields: [{ label: "Number to Buy", type: "number", value: "price" }],
    userEvent: {
      _id: "",
      image: "",
      region: "dublin",
      lat: 53.34723555464459,
      lng: -6.258907671241786,
      title: "",
      venue: "",
      address1: "",
      address2: "",
      address3: "",
      address4: "",
      description: "",
      startDetails: "",
      endDetails: "",
      organiser: { _id: "", name: "", stripeAccountID: "", salesPlan: "" },
      currency: "EUR",
      tickets: [
        {
          ticketType: "",
          ticketTypeID: "",
          price: "",
          numberOfTickets: "",
          sellWhenPrevSoldOut: "",
          startSelling: "",
          stopSelling: "",
          startSellingTime: "",
          stopSellingTime: "",
          ticketDescription: "",
          quantityRequested: 0,
          refunds: {
            optionSelected: "excessDemand",
            refundUntil: "",
            howToResell: "auction",
            resellAtSpecificPrice: "",
            minimumPrice: "",
            nameOfResoldTickets: "lastMinuteTickets",
          },
        },
      ],
      fixedCharge: '',
      variableCharge: ''
    },
    currency: {
      USD: "$",
      EUR: "€",
      NZD: "$",
    },
    purchaserEmail: '',
    cardCountry: 'EU',
    stripeCustomerID: "",
    errorMsg: "",
    lastMinuteTicketCharges: {
      subTotal: 0,
      fixedCharge: 0,
      variableCharge: 0,
      vatOnCharges: 0,
    },
    purchaseTicketCharges: {
      subTotal: 0,
      fixedCharge: 0,
      variableCharge: 0,
      vatOnCharges: 0,
    },
    message: "",
    messageColor: "#293d6a",
    checkBoxes: {
      promotionalMaterial: false,
      holdOnCard: false,
      chargeForNoShows: false,
      waitList: false,
      shareData: false
    },
    displayRefundStatus: false,
    errors: [],
    allTicketsSoldOut: false,
    specificWaitListDateError: ''
  };

  componentDidMount() {
    let token = "";
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
    }
    let objectToSend = {
      token: token,
      specificEvent: this.props.match.params.id,
    };

    axios
      .post(`${process.env.REACT_APP_API}/retrieveEventByID`, objectToSend)
      .then((res) => {
        let allTicketsSoldOut = res.data.userEvent.tickets.every(e=>e.soldOut)
        if(res.data.userEvent.tickets.length === 0){allTicketsSoldOut = true}      
        this.setState({
          purchaserEmail: res.data.purchaserEmail,
          userEvent: res.data.userEvent,
          allTicketsSoldOut: allTicketsSoldOut,
        });
      })
      .catch((err) => console.log("errr", err));
  }

  calculateSubTotal = () => {
    let tickets = this.getRequestedTickets()
    if(tickets.length === 0){return 0}
    let subTotal = tickets.map(ticket => ticket.quantityRequested*ticket.price).reduce((a,b) => a+b)
    return subTotal
  }

  calculateTotalCharge = () => {
    let tickets = this.getRequestedTickets()
    if(tickets.length === 0){return 0}
    let totalCharge = this.calculateSubTotal() + this.calculateFees()
    let rounded = this.roundToTwo(totalCharge)
    return rounded
   }

  calculateFees = () => {
    let tickets = this.getRequestedTickets()
    if(tickets.length === 0){return 0}
    let totalFeesArray = []
    tickets.forEach(ticket => {
      let fixedCharge = this.state.userEvent.fixedCharge
      let variableCharge = this.state.userEvent.variableCharge
      let feePerTicket = this.roundToTwo(fixedCharge + (ticket.price*variableCharge))
      let chargeExVat = this.roundToTwo(feePerTicket * ticket.quantityRequested)
      totalFeesArray.push(chargeExVat)
    })
    let totalFeesExVat= totalFeesArray.reduce((a,b)=> a+b)
    let vatOnCharges = this.roundToTwo(0.23*(totalFeesExVat))
    return totalFeesExVat + vatOnCharges
  }

  calculateTotalFines = (tickets) => {
    return tickets
    .map(ticket => ticket.quantityRequete * ticket.chargeForNoShows)
    .reduce((a, b) => a + b);
  }

  changeCardCountry = (event) => {
    let cardCountry = event.target.value
    this.setState({cardCountry})
  }

  changeEmail = (event) => {
    let purchaserEmail = event.target.value
    this.setState({ purchaserEmail })
  }

  changeQuantity = (index, quantity, clearMessage) => {
    let userEvent = this.state.userEvent;
    userEvent.tickets[index].quantityRequested = quantity;
    this.setState({ userEvent });
    if(clearMessage){ 
      this.setState({ message: "" })  
      this.hideRefundStatus()
    }
    this.resetWaitListCheckBox()
  }

  changeMessageColor = (color) => {
    let messageColor
    if(color ==='blue'){messageColor = '#293d6a'}
    else if(color === 'red'){messageColor = '#e84c3d'}
    else if (color === 'green'){messageColor= '#1c7816'}
    this.setState({ messageColor })
  }

  changeWaitListExpiration = (event, index) => {
    let userEvent = this.state.userEvent
    userEvent.tickets[index].waitListExpires = event.target.value;
    this.resetWaitListCheckBox()
    this.setState(userEvent)
  }

  checkBoxesAreTicked = () => {
    let checkBoxErrors = [];
    checkBoxErrors = this.waitListCheckBoxTicked(checkBoxErrors)
    if(!this.state.checkBoxes.shareData){
      checkBoxErrors.push('shareData')
    }
    if (checkBoxErrors.length > 0) {
      this.changeMessageColor('red')
      let errors = checkBoxErrors;
      let message = "Please agree to all mandatory terms and conditions";
      this.setState({ errors, message });
      return false;
    } 
      this.clearMessage();
      return true;
  }

  clearMessage = () => {
    this.setState({ message: "" });
    this.changeMessageColor('blue')
  }

  determineCheckBoxes = () => {

    let checkBoxes = []
    let selectedTickets = this.getRequestedTickets()
    let waitListTickets = selectedTickets.filter(e=>e.lastMinuteTicket)

    if(waitListTickets.length > 0){
      checkBoxes.push({
        text: `I agree that my card can be charged €${this.calculateTotalCharge().toFixed(2)} before ${this.waitListExpirationTime(waitListTickets)}`,
        checkBox: "waitList",
      })
    }

    checkBoxes.push({
      text: `I agree to share my data with the event organiser`,
      checkBox: "shareData",
    })

    checkBoxes.push({
      text: `I agree to receive promotional material from the event organiser`,
      checkBox: "promotionalMaterial",
    })

    return checkBoxes
  }

  displayAdminFee = () => {
    return (
      this.state.purchaseTicketCharges.fixedCharge +
      this.state.purchaseTicketCharges.variableCharge +
      this.state.purchaseTicketCharges.vatOnCharges
    ).toFixed(2);
  }

  displayCheckBoxes = (checkBoxes) => {
    return checkBoxes.map((e, i) => 
        <div
          key={i}
          className={`event-check-box-question   ${this.state.errors.includes(e.checkBox) ? "colorRed" : ""}`}
        >
          <input
            type="checkbox"
            name={e.checkBox}
            checked={this.state.checkBoxes[e.checkBox]}
            onChange={(event) => this.handleCheckBoxChange(event)}
          />
          {` ${e.text}`}
        </div>
    )
  }

  displaySoldOutMessage = () => {
    return(
      <div className={'sold-out-message'}>
        Sorry, all tickets are sold out
      </div>
    )
  }

  displaySpecificDate = (event, index) => {
    let specificWaitListDateError = ''
    let userEvent = this.state.userEvent
    userEvent.tickets[index].waitListSpecificDate = event;
    if(moment(event).isAfter(userEvent.tickets[0].stopSellingTime)){
      userEvent.tickets[index].waitListSpecificDate = Date.parse(userEvent.tickets[0].stopSellingTime)
      specificWaitListDateError = `The latest time you can secure a ticket is ${moment(userEvent.tickets[0].stopSellingTime).format('Do MMMM YYYY [at] HH:mm')}`
    }
    this.resetWaitListCheckBox()
    this.setState({userEvent, specificWaitListDateError})
  }

  displayStartAndEndTimes = () => {
    let startDay = moment(this.state.userEvent.startDetails).format("ddd D MMM YYYY")
    let startTime = moment(this.state.userEvent.startDetails).format("HH:mm")
    let endDay = moment(this.state.userEvent.endDetails).format("ddd D MMM YYYY")
    let endTime = moment(this.state.userEvent.endDetails).format("HH:mm")
    if(startDay === endDay){return `${startDay} from ${startTime} until ${endTime}`}
    return `${startDay} at ${startTime} until ${endDay} at ${endTime}`
  }

  displayTickets = () => {
    if(this.state.allTicketsSoldOut){return this.displaySoldOutMessage()}
    let tickets = this.state.userEvent.tickets

    return (tickets.map((ticket, index) => {
      return (
        <div key={index}>
          <ColmTicket
            changeDeliveryOption = {this.changeDeliveryOption}
            changeQuantity={this.changeQuantity}
            changeWaitListExpiration={this.changeWaitListExpiration}
            displaySpecificDate={this.displaySpecificDate}
            index={index}
            ticket = {JSON.parse(JSON.stringify(ticket))}
            waitListSpecificDate = {ticket.waitListSpecificDate}
            ticketsAvailable = {ticket.ticketsAvailable}
            specificWaitListDateError = {this.state.specificWaitListDateError}
          />
        </div>
      );
    }))    
  }

  displayWaitListMessage = () => {
    if(this.state.userEvent.tickets.filter(e => e.lastMinuteTicket).length === 0){return}
    return (
      <>
        <div className={'wait-list-message'}>A limited number of additional tickets will become available shortly. </div>
        <div className={'wait-list-message'}> These will be allocated on a first-come first-serve basis to customers who join the wait list.</div>
        <div className={'wait-list-message'}>Your card will not be charged unless you secure tickets.</div>  
      </>     
    )
  }

  getConnectedCheckoutForm = () => {

    if(this.state.userEvent.organiser.stripeAccountID === ""){return}
    let requestedTickets = this.getRequestedTickets()

    return (
      <StripeProvider
        apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}
        stripeAccount={
          this.state.userEvent.organiser.stripeAccountID 
          // || undefined
        }
        // key={this.state.checkBoxes.saveCard || "platform"}
      >
        <Elements>
          <CheckoutForm
            cardCountry = {this.state.cardCountry}
            changeCardCountry = {this.changeCardCountry}
            changeEmail = {this.changeEmail}
            changeMessageColor={this.changeMessageColor}
            changeQuantity={this.changeQuantity}
            clearMessage = {this.clearMessage}
            displayRefundStatus={this.state.displayRefundStatus}
            message ={this.state.message}
            messageColor={this.state.messageColor}
            promotionalMaterial={this.state.checkBoxes.promotionalMaterial}
            purchaserEmail={this.state.purchaserEmail}
            purchaseErrorsExist={this.purchaseErrorsExist}
            requestedTickets={requestedTickets}
            resetTicketQuantities={this.resetTicketQuantities}
            tickets={this.getRequestedTickets()}
            toggleRefundStatusDisplay = {this.toggleRefundStatusDisplay}
            total={this.calculateTotalCharge()}
            updateMessage={this.updateMessage}
            userEvent={this.state.userEvent}
          />
        </Elements>
      </StripeProvider>
    );

  }

  getLocation = (userEvent) => {
    let locationArray = [
      userEvent.venue,
      userEvent.address1,
      userEvent.address2,
      userEvent.address3,
      userEvent.address4,
    ]
    locationArray = locationArray.filter(e => e!== '')
    return locationArray.join(", ");
  }

  getRequestedTickets = () => {
    let selectedTickets = this.state.userEvent.tickets.filter(ticket => ticket.quantityRequested > 0)
    return selectedTickets
  }

  getUnconnectedCheckoutForm = (requestedTickets) => {
    if(this.state.userEvent.organiser.stripeAccountID === ""){return}
    return (
      <StripeProvider apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}>
        <Elements>
          <CheckoutForm
            total={this.calculateTotalCharge()}
            ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
            currency={this.state.userEvent.currency}
            eventTitle={this.state.userEvent.title}
            userEvent={this.state.userEvent}
            updateMessage={this.updateMessage}
            requestedTickets={requestedTickets}
            errors={this.state.errors}
            selectedTickets={this.getRequestedTickets()}
            purchaseErrorsExist={this.purchaseErrorsExist}
            connected={false}
            cardDetails={this.state.cardDetails}
          />
        </Elements>
      </StripeProvider>
    );
  }

  handleCheckBoxChange = (e) => {
    let checkBoxes = this.state.checkBoxes;
    let errors = this.state.errors;

    let indexOfError = errors.indexOf(e.target.name);

    if (indexOfError !== -1) {
      errors.splice(indexOfError, 1);
    }
    this.hideRefundStatus()
    checkBoxes[e.target.name] = !checkBoxes[e.target.name];
    this.setState({ checkBoxes, errors });
    if (this.state.errors.length === 0) {
      this.clearMessage();
    }
  }

  hideRefundStatus = () => {
    let displayRefundStatus = false
    this.setState({displayRefundStatus})
  }

  insufficentTickets = (selectedTickets) => {
    let insufficentTickets = selectedTickets.find(ticket => Number(ticket.quantityRequested) > ticket.ticketsAvailable)
    if(insufficentTickets === undefined){return false}
    this.changeMessageColor('red')
    let message
    if(insufficentTickets.ticketsAvailable > 1){message = `You have selected ${insufficentTickets.quantityRequested} ${insufficentTickets.ticketType} tickets but only ${insufficentTickets.ticketsAvailable} are available`}
    else{message = `You have selected ${insufficentTickets.quantityRequested} ${insufficentTickets.ticketType} tickets but only 1 ticket is available`}
    let errors = "insufficientTickets"
    this.setState({ errors, message })
    return true
  }

  noTicketsSelected = () => {
    let numberOfTickets = this.state.userEvent.tickets.map(ticket => Number(ticket.quantityRequested)).reduce( (a,b) => a+b )
    if (numberOfTickets === 0) {
      this.changeMessageColor('red')
      let message = "You have not selected any tickets to purchase"
      let errors = "quantity"
      this.setState({ errors, message })
      return true
    }
  }

  purchaseErrorsExist = () => {
    let selectedTickets = this.getRequestedTickets()
    if(this.noTicketsSelected()){return true}
    if(this.insufficentTickets(selectedTickets)){return true}
    if(this.checkBoxesAreTicked(selectedTickets)){return false}
    return true
  }

  resetTicketQuantities = () => {
    let tickets = this.state.userEvent.tickets
      tickets.forEach((ticket, index) => {
      this.changeQuantity(index, 0, false)
    })
  }

  resetWaitListCheckBox = () => {
    let selectedTickets = this.getRequestedTickets()
    if(selectedTickets.filter(e=>e.lastMinuteTicket).length === 0){return}
    let checkBoxes = this.state.checkBoxes
    checkBoxes.waitList = false
    this.setState({  checkBoxes })
  }

  roundToTwo = (num) => {    
    return +(Math.round(num + "e+2")  + "e-2");
  }


  toggleRefundStatusDisplay = () => {
    let displayRefundStatus = this.state.displayRefundStatus
    displayRefundStatus = !displayRefundStatus
    this.setState({displayRefundStatus})
  }

  updateMessage = (msg) => {
    this.setState({ message: msg });
  }

  waitListExpirationTime = (waitListTickets) => {
    let time
    if(waitListTickets[0].waitListExpires === 'specific'){
      time = waitListTickets[0].waitListSpecificDate
    }
    else if(waitListTickets[0].waitListExpires === 'starts'){
      time = this.state.userEvent.startDetails
    }
    else if(waitListTickets[0].waitListExpires === 'hourBeforeEnds'){
      console.log('this.state.userEvent.endDetails', this.state.userEvent.endDetails)
      time = Date.parse(this.state.userEvent.endDetails) - 60*60*1000
      console.log('time', time)
      //fix this

    }
    if(moment(time).isAfter(waitListTickets[0].stopSellingTime)){
      time = waitListTickets[0].stopSellingTime
    }

    return `${moment(time).format('Do MMMM YYYY')} at ${moment(time).format('HH:mm')}`
  }

  waitListCheckBoxTicked = (checkBoxErrors) => {
    let selectedTickets = this.getRequestedTickets()
    let waitListTickets = selectedTickets.filter(e => e.lastMinuteTicket)
    if (waitListTickets.length> 0 && !this.state.checkBoxes.waitList){
      checkBoxErrors.push('waitList')
    }
    return checkBoxErrors
  }

  getOrganiserName = () => {
    if(this.state.userEvent._id === undefined){return}
    if(this.state.userEvent._id === '62d5c866a1b375717566969b'){return ' In 4 Squash'}
    return ` ${this.state.userEvent.organiser.name}`
  }

  render() {
    let checkBoxes = this.determineCheckBoxes()
    let checkoutFormConnected = this.getConnectedCheckoutForm()  
    let fees = this.calculateFees(this.state.userEvent.tickets).toFixed(2)  
    let location = this.getLocation(this.state.userEvent) 
    let subTotal = this.calculateSubTotal().toFixed(2)
    let totalCharge = this.calculateTotalCharge().toFixed(2)

    return (
      <>
        <Nav />
        <div className="event-box">
          <img src={this.state.userEvent.imageURL} alt={'chosen by event organiser'}/>
          <section className="event-details">
            <div className="event-center">
              <header>{this.state.userEvent.title}</header>
              <hr />
              <div className="event-time-location-organiser">
                <p><FontAwesomeIcon icon={faCalendarAlt} className="fontawesome-icon"/>{` ${this.displayStartAndEndTimes()}`} </p>
                <p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${this.state.userEvent.lat},${this.state.userEvent.lng}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faMapMarker} className="fontawesome-icon"/>{` ${location}`}
                  </a>
                </p>
                <p><FontAwesomeIcon icon={faUser} className="fontawesome-icon" />{this.getOrganiserName()}</p>
              </div>
            </div>
          </section>
        </div>
        <div className="event-description-and-tickets-wrapper">
          <section className="event-description">
            <header>Details</header>
            <hr />
            {this.state.userEvent.description}
          </section>
          <section className="event-tickets">
            <header>Tickets</header>
            <hr />
            {this.displayWaitListMessage()}
            {this.displayTickets()}
            <hr />
            <div className={this.state.allTicketsSoldOut ? 'sold-out' : 'all-ticket-details'}>
              <div className="event-details-before-payment">
                <div> Subtotal: €{subTotal}</div>
                <div>Fees: €{fees}</div>
                <div className="event-total-charge">Total: €{totalCharge}</div>
                <hr id="event-total-charge-bottom-hr" />
                {this.displayCheckBoxes(checkBoxes)} 
              </div>
              {checkoutFormConnected}
            </div>
          </section>
        </div>

        
        <Footer />
      </>
    );
  }
}

export default Event;






    
 



