import React from "react";
import axios from "axios";
import moment from "moment";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import Nav from "./Nav";
import ColmTicket from "./ColmTicket";
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
    },
    currency: {
      USD: "$",
      EUR: "€",
      NZD: "$",
    },
    purchaserEmail: '',
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
      waitList: false
    },
    errors: [],
    allTicketsSoldOut: false
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
        console.log('res.data,', res.data)
        let allTicketsSoldOut = res.data.userEvent.tickets.every(e=>e.soldOut)
        if(res.data.userEvent.tickets.length === 0){allTicketsSoldOut = true}
        console.log('allTicketsSoldOut', allTicketsSoldOut)
      
        this.setState({
          purchaserEmail: res.data.purchaserEmail,
          stripeCustomerID: res.data.stripeCustomerID,
          userEvent: res.data.userEvent,
          allTicketsSoldOut: allTicketsSoldOut
        });
      })
      .catch((err) => console.log("errr", err));
  }

  calculateStripeFee = () => {
    return 1.23 * (0.25 + 0.014 * this.displayTotal());
  }

  calculateTotalCharge = () => {
    return (this.state.purchaseTicketCharges.subTotal + this.calculateTotalFees()).toFixed(2)
   }

  calculateTotalFees = () => {
    return (this.state.purchaseTicketCharges.fixedCharge + this.state.purchaseTicketCharges.variableCharge +this.state.purchaseTicketCharges.vatOnCharges)
  }

  calculateTotalFines = (tickets) => {
    return tickets
    .map(ticket => ticket.quantityRequete * ticket.chargeForNoShows)
    .reduce((a, b) => a + b);
  }

  changeEmail = (event) => {
    let purchaserEmail = event.target.value
    this.setState({ purchaserEmail })
  }

  changeQuantity = (index, quantity, clearMessage) => {
    let userEvent = this.state.userEvent;
    userEvent.tickets[index].quantityRequested = quantity;
    this.setState({ userEvent });
    if(clearMessage){ this.setState({ message: "" })  }
    this.regularTicketsCalculateTotals();
    this.resetWaitListCheckBox()
  }

  changeMessageColor = (color) => {
    let messageColor
    if(color ==='blue'){messageColor = '#293d6a'}
    else if(color === 'red'){messageColor = '#e84c3d'}
    else if (color === 'green'){messageColor= '#1c7816'}
    this.setState({ messageColor })
  }

  changeWaitListExpiration = (event, placeInOriginalArray) => {
    let userEvent = this.state.userEvent
    userEvent.tickets[placeInOriginalArray].waitListExpires = event.target.value;
    this.setState(userEvent)
  }

  checkBoxesAreTicked = () => {
    let checkBoxErrors = [];
    checkBoxErrors = this.waitListCheckBoxTicked(checkBoxErrors)
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
    let selectedTickets = this.getSelectedTickets()
    let waitListTickets = selectedTickets.filter(e=>e.lastMinuteTicket)

    if(waitListTickets.length > 0){
      checkBoxes.push({
        text: `I agree that my card can be charged €${this.calculateTotalCharge()} before ${this.waitListExpirationTime(waitListTickets)}`,
        checkBox: "waitList",
      })
    }

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

  displaySoldOutMessage = () => {
    return(
      <div className={'sold-out-message'}>
        Sorry, all tickets are sold out
      </div>
    )
  }

  displaySpecificDate = (event, placeInOriginalArray) => {
    let userEvent = this.state.userEvent
    userEvent.tickets[placeInOriginalArray].waitListSpecificDate = event;
    if(moment(event).isAfter(userEvent.tickets[0].stopSellingTime)){
      userEvent.tickets[placeInOriginalArray].waitListSpecificDate = Date.parse(userEvent.tickets[0].stopSellingTime)
    }
    this.setState(userEvent)
  }

  displayStartAndEndTimes = () => {
    let startDay = moment(this.state.userEvent.startDetails).format("ddd D MMM YYYY")
    let startTime = moment(this.state.userEvent.startDetails).format("HH:mm")
    let endDay = moment(this.state.userEvent.endDetails).format("ddd D MMM YYYY")
    let endTime = moment(this.state.userEvent.endDetails).format("HH:mm")
    if(startDay === endDay){return `${startDay} from ${startTime} until ${endTime}`}
    return `${startDay} at ${startTime} until ${endDay} at ${endTime}`
  }

  displayTickets = (tickets) => {
    if(this.state.allTicketsSoldOut){return this.displaySoldOutMessage()}

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
          />
        </div>
      );
    }))    
  }

  displayTotal = () => {
    return (
      this.state.purchaseTicketCharges.fixedCharge +
      this.state.purchaseTicketCharges.variableCharge +
      this.state.purchaseTicketCharges.subTotal +
      this.state.purchaseTicketCharges.vatOnCharges
    ).toFixed(2);
  };

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

  getConnectedCheckoutForm = (requestedTickets) => {

    if(this.state.userEvent.organiser.stripeAccountID === ""){return}

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
            changeEmail = {this.changeEmail}
            changeMessageColor={this.changeMessageColor}
            changeQuantity={this.changeQuantity}
            clearMessage = {this.clearMessage}
            message ={this.state.message}
            messageColor={this.state.messageColor}
            purchaserEmail={this.state.purchaserEmail}
            purchaseErrorsExist={this.purchaseErrorsExist}
            requestedTickets={requestedTickets}
            tickets={this.getSelectedTickets()}
            total={this.displayTotal()}
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

  getRequestedTickets = (allTickets) => {
    return allTickets
    .filter(ticket =>ticket.quantityRequested > 0)
    .map(ticket => {
      return {
        ticketType: ticket.ticketType,
        ticketTypeID: ticket.ticketTypeID,
        quantityRequested: ticket.quantityRequested,
        finalFewTicket: ticket.finalFewTicket,
        lastMinuteTicket: ticket.lastMinuteTicket,
      };
    });
  }

  getSelectedTickets = () => {
    return this.state.userEvent.tickets.filter(ticket => ticket.quantityRequested > 0)
  }

  getUnconnectedCheckoutForm = (requestedTickets) => {
    if(this.state.userEvent.organiser.stripeAccountID === ""){return}
    return (
      <StripeProvider apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}>
        <Elements>
          <CheckoutForm
            total={this.displayTotal()}
            ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
            currency={this.state.userEvent.currency}
            eventTitle={this.state.userEvent.title}
            userEvent={this.state.userEvent}
            updateMessage={this.updateMessage}
            requestedTickets={requestedTickets}
            errors={this.state.errors}
            selectedTickets={this.getSelectedTickets()}
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

    checkBoxes[e.target.name] = !checkBoxes[e.target.name];
    this.setState({ checkBoxes, errors });
    if (this.state.errors.length === 0) {
      this.clearMessage();
    }
  };

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
    console.log('numberOfTickets', numberOfTickets)
    if (numberOfTickets === 0) {
      this.changeMessageColor('red')
      let message = "You have not selected any tickets to purchase"
      let errors = "quantity"
      this.setState({ errors, message })
      return true
    }
  }

  purchaseErrorsExist = () => {
    let selectedTickets = this.getSelectedTickets()
    if(this.noTicketsSelected()){return true}
    if(this.insufficentTickets(selectedTickets)){return true}
    if(this.checkBoxesAreTicked(selectedTickets)){return false}
    return true
  }

  regularTicketsCalculateTotals = () => {
    let subTotal = 0;
    let fixedCharge = 0;
    let variableCharge = 0;
    let totalTickets = 0;
    let purchaseTicketCharges = {};

    let tickets = this.state.userEvent.tickets.filter(
      (e) => e.quantityRequested > 0 && e.price > 0
    );

    let highPriceTickets = tickets.filter((e) => e.price > 10);

    tickets.forEach((e) => {
      subTotal += e.quantityRequested * e.price;
    });

    tickets.forEach((e) => {
      totalTickets += Number(e.quantityRequested);
    });

    if (this.state.userEvent.organiser.salesPlan === "basic") {
      fixedCharge = totalTickets * 0.49;
      if (tickets[0].price > 10) {
        variableCharge = subTotal * 0.04;
      }
    } else {
      fixedCharge = totalTickets * 0.69;
      highPriceTickets.forEach((e) => {
        variableCharge += Number(e.quantityRequested) * e.price * 0.055;
      });
    }
    let vatOnCharges = 0.23 * (fixedCharge + variableCharge);

    purchaseTicketCharges.subTotal = subTotal;
    purchaseTicketCharges.fixedCharge = fixedCharge;
    purchaseTicketCharges.variableCharge = variableCharge;
    purchaseTicketCharges.vatOnCharges = vatOnCharges;
    this.setState({ purchaseTicketCharges });
  }

  resetWaitListCheckBox = () => {
    let selectedTickets = this.getSelectedTickets()
    if(selectedTickets.filter(e=>e.lastMinuteTicket).length === 0){return}
    let checkBoxes = this.state.checkBoxes
    checkBoxes.waitList = false
    this.setState({  checkBoxes })
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

    return `${moment(time).format('D MMM YYYY')} at ${moment(time).format('HH:mm')}`
  }

  waitListCheckBoxTicked = (checkBoxErrors) => {
    let selectedTickets = this.getSelectedTickets()
    let waitListTickets = selectedTickets.filter(e => e.lastMinuteTicket)
    if (waitListTickets.length> 0 && !this.state.checkBoxes.waitList){
      checkBoxErrors.push('waitList')
    }
    return checkBoxErrors
  }



  render() {
    let requestedTickets = this.getRequestedTickets(this.state.userEvent.tickets)
    let fees = this.calculateTotalFees()
    let checkBoxes = this.determineCheckBoxes()
    let checkoutFormConnected = this.getConnectedCheckoutForm(requestedTickets)    
    let location = this.getLocation(this.state.userEvent) 



    return (
      <>
        <Nav />
  

        <div className="event-box">
          <img src={this.state.userEvent.imageURL} alt={'chosen by event organiser'}/>

          <section className="event-details">
            <div className="event-center">
              <header>{this.state.userEvent.title}</header>
              <hr />
              <p>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="fontawesome-icon"
                />{" "}
                {this.displayStartAndEndTimes()}
              </p>

              <p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${this.state.userEvent.lat},${this.state.userEvent.lng}`}
                  target="_blank"
                  rel="noopener noreferrer">
                <FontAwesomeIcon
                  icon={faMapMarker}
                  className="fontawesome-icon"
                />{" "}
                {location}
                </a>
              </p>

 

              <p id="tickets-remaining">
                <FontAwesomeIcon icon={faUser} className="fontawesome-icon" />{" "}
                {this.state.userEvent.organiser.name}
              </p>
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
            {this.displayTickets(this.state.userEvent.tickets)}
              <hr />






            <div className={this.state.allTicketsSoldOut ? 'sold-out' : 'all-ticket-details'}>

              <div className="event-details-before-payment">
                <div> Subtotal: €{this.state.purchaseTicketCharges.subTotal.toFixed(2)}</div>
                <div>Fees: €{fees.toFixed(2)}</div>
                <div className="event-total-charge">Total: €{this.calculateTotalCharge()}</div>
                {/* <hr /> */}
                <hr id="event-total-charge-bottom-hr" />
                {checkBoxes.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className={`event-check-box-question   ${
                        this.state.errors.includes(e.checkBox) ? "colorRed" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={e.checkBox}
                        // ref={this[e.checkBox]}
                        checked={this.state.checkBoxes[e.checkBox]}
                        onChange={(event) =>
                          this.handleCheckBoxChange(event)
                        }
                      />
                      {` ${e.text}`}
                    </div>
                  );
                })}

                
              </div>

              {checkoutFormConnected}

           
            </div>
          </section>
        </div>


      </>
    );
  }
}

export default Event;






    
 



