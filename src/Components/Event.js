import React from "react";
import axios from "axios";
import moment from "moment";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import SaveCardForm from "./SaveCardForm";
import Nav from "./Nav";
import BuyTicket from "./BuyTicket";
import ColmTicket from "./ColmTicket";
import LastMinuteTickets from "./LastMinuteTickets";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarker,
  faGlobeEurope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "../Styles/Event.css";
import "../Styles/Global.css";

class Event extends React.Component {
  constructor() {
    super();
    this.changeNumTickets = this.changeNumTickets.bind(this);
    this.calculateStripeFee = this.calculateStripeFee.bind(this);
    // this.shareData = React.createRef()  
    // this.shareData = React.createRef() 
    // this.chargeNoShows = React.createRef() 
  }



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
          refunds: {
            optionSelected: "excessDemand",
            refundUntil: "",
            howToResell: "auction",
            resellAtSpecificPrice: "",
            minimumPrice: "",
            nameOfResoldTickets: "lastMinuteTickets",
          },
          buy: {
            numTicketsSought: 0,
          },
        },
      ],
    },
    currency: {
      USD: "$",
      EUR: "€",
      NZD: "$",
    },
    purchaser: "",
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
    cardDetails: {
      last4: "",
      card: "",
    },
    replaceExistingCard: false,
    message: "",
    checkBoxes: {
      shareData: false,
      holdOnCard: false,
      chargeNoShows: false,
    }
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
        this.setState({
          purchaser: res.data.purchaser,
          cardDetails: res.data.cardDetails,
          stripeCustomerID: res.data.stripeCustomerID,
          userEvent: res.data.userEvent,
        });
      })
      .catch((err) => console.log("errr", err));
  }

  calculateStripeFee = () => {
    return 1.23 * (0.25 + 0.014 * this.displayTotal());
  };

  calculateTotals = (data) => {
    let subTotal = 0;
    let fixedCharge = 0;
    let variableCharge = 0;
    let totalTickets = 0;
    let allTickets = this.state.userEvent.tickets;
    let purchaseTicketCharges;
    let lastMinuteTicketCharges;

    let tickets;
    if (data.lastMinuteTicket === false) {
      tickets = this.state.userEvent.tickets.filter((e) => {
        return (
          e.lastMinuteTicket !== true &&
          e.chargeForTicketsStatus === "chargeForTickets"
        );
      });
      purchaseTicketCharges = this.state.purchaseTicketCharges;
    } else {
      tickets = this.state.userEvent.tickets.filter((e) => {
        return (
          e.lastMinuteTicket === true &&
          e.chargeForTicketsStatus === "chargeForTickets"
        );
      });
      lastMinuteTicketCharges = this.state.lastMinuteTicketCharges;
    }

    let highPriceTickets = tickets.filter((e) => {
      return e.price > 10;
    });
    tickets.forEach((e) => {
      subTotal += e.buy.numTicketsSought * e.price;
    });
    tickets.forEach((e) => {
      totalTickets += Number(e.buy.numTicketsSought);
    });
    if (this.state.userEvent.organiser.salesPlan === "basic") {
      fixedCharge = totalTickets * 0.49;
      if (tickets[0].price > 10) {
        variableCharge = subTotal * 0.04;
      }
    } else {
      fixedCharge = totalTickets * 0.69;
      highPriceTickets.forEach((e) => {
        variableCharge += Number(e.buy.numTicketsSought) * e.price * 0.055;
      });
    }
    let vatOnCharges = 0.23 * (fixedCharge + variableCharge);

    if (data.lastMinuteTicket === false) {
      purchaseTicketCharges.subTotal = subTotal;
      purchaseTicketCharges.fixedCharge = fixedCharge;
      purchaseTicketCharges.variableCharge = variableCharge;
      purchaseTicketCharges.vatOnCharges = vatOnCharges;
      this.setState({ purchaseTicketCharges });
    } else {
      lastMinuteTicketCharges.subTotal = subTotal;
      lastMinuteTicketCharges.fixedCharge = fixedCharge;
      lastMinuteTicketCharges.variableCharge = variableCharge;
      lastMinuteTicketCharges.vatOnCharges = vatOnCharges;
      this.setState({ lastMinuteTicketCharges });
    }
  };

  changeQuantity = (i, quantity) => {
    let userEvent = this.state.userEvent;
    userEvent.tickets[i].buy.numTicketsSought = quantity;
    this.setState({ userEvent: userEvent, message: '' })
  };

  displayAdminFee = () => {
    return (
      this.state.purchaseTicketCharges.fixedCharge +
      this.state.purchaseTicketCharges.variableCharge +
      this.state.purchaseTicketCharges.vatOnCharges
    ).toFixed(2);
  };

  displayTotal = () => {
    return (
      this.state.purchaseTicketCharges.fixedCharge +
      this.state.purchaseTicketCharges.variableCharge +
      this.state.purchaseTicketCharges.subTotal +
      this.state.purchaseTicketCharges.vatOnCharges
    ).toFixed(2);
  };

  changeNumTickets = (e, i) => {
    let userEvent = this.state.userEvent;
    userEvent.tickets[i].buy.numTicketsSought = Number(e.target.value);
    this.setState({
      userEvent: userEvent,
    });
  };

  chargeExistingCard = (e) => {
    e.preventDefault();

    this.setState({ message: "Saving Your Bid. Please Wait..." });
    let objectToSend = {
      waitListData: this.state.userEvent.tickets.filter(
        (e) => e.lastMinuteTicket === true && e.buy.numTicketsSought > 0
      ),
      purchaserID: this.state.purchaser,
      userEventID: this.state.userEvent._id,
      replaceExistingCard: this.state.replaceExistingCard,
      cardSaved: this.state.cardDetails.cardSaved,
    };

    console.log("objectToSend", objectToSend);

    axios
      .post(`${process.env.REACT_APP_API}/purchaseWaitList`, objectToSend)
      .then((res) => {
        this.setState({ message: res.data.message });
      });
  };

  handleCheckBoxChange = (e) => {
   
  let checkBoxes = this.state.checkBoxes
  checkBoxes[e.target.name] = !checkBoxes[e.target.name]
  this.setState(checkBoxes)

  }

  payWithSavedCard = (e, numTicketsSought, selectedTickets) => {
    e.preventDefault();

 

    //are checkboxes checked

    let checkBoxErrors = []

    if(!this.state.checkBoxes.shareData){checkBoxErrors.push('shareData')}

    if(selectedTickets.filter(e=>e.price === 0 && e.chargeForNoShows > 0 && !e.hold).length>0){
      
      if(!this.state.checkBoxes.chargeForNoShows){checkBoxErrors.push('chargeForNoShows')}

    }else if(selectedTickets.filter(e=>e.price === 0 && e.chargeForNoShows > 0 && e.hold).length>0){
      if(!this.state.checkBoxes.holdOnCard){checkBoxErrors.push('holdOnCard')}
    }

    if(checkBoxErrors.length > 0){
      console.log('checkBoxErrors', checkBoxErrors)

      let firstError = this[checkBoxErrors[0]]

      console.log('firstError',firstError)

      firstError.current.scrollIntoView()
    }else{

    this.setState({ message: "Checking for tickets. Please Wait..." });

    let objectToSend = {
      checkForTickets: {
        numTicketsSought: numTicketsSought,
        purchaser: this.state.purchaser,
        userEvent: this.state.userEvent._id,
      },
      stripeData: {
        amount: this.displayTotal(),
        currency: this.state.currency,
        description: this.state.userEvent.title,
        moneyForColm: this.displayAdminFee() - this.calculateStripeFee(),
        seller: this.state.userEvent.organiser._id,
      },
      ticketTypesEquivalent: this.state.userEvent.ticketTypesEquivalent,
      waitListData: this.state.userEvent.tickets.filter(
        (e) => e.lastMinuteTicket === true && e.buy.numTicketsSought > 0
      ),
      cardSaved: this.state.cardDetails.cardSaved,
      replaceExistingCard: this.state.replaceExistingCard,
    };

    axios
      .post(`${process.env.REACT_APP_API}/paymentIntent`, objectToSend)
      .then((res) => {
        this.setState({ message: res.data.message });

        if (res.data.success) {
          this.props.stripe
            .handleCardPayment(res.data.clientSecret, {})
            .then((paymentRes) => {
              if (paymentRes.error) {
                this.setState({ message: paymentRes.error.message }) // run some javascript to make the text red.
                axios.post(`${process.env.REACT_APP_API}/deleteTempTickets`, {
                  tickets: res.data.tickets,
                  refunds: res.data.refundRequests,
                  ticketsAlreadyRefunded: res.data.ticketsAlreadyRefunded,
                }); //amend to include overdue refunds
                //i've never tested this. also need to include it anywhere else payment might fail

                {
                  /*Secuirty Issue: There is a window here for hacker to manually post the tickets to backend to make them valid using updateTicketData controller*/
                }
              } else if (paymentRes.paymentIntent.status === "succeeded") {
                let updateTicketData = {
                  purchaser: this.props.purchaser,
                  tickets: res.data.tickets,
                  ticketsAlreadyRefunded: res.data.ticketsAlreadyRefunded,
                  refundRequests: res.data.refundRequests,
                  paymentIntentID: paymentRes.paymentIntent.id,
                  userEvent: this.props.userEvent._id,
                };

                axios
                  .post(
                    `${process.env.REACT_APP_API}/emailTickets`,
                    updateTicketData
                  )
                  .then((res) => {
                    this.setState({ message: res.data.message });
                  })
                  .catch((err) => console.log("create tickets err", err));
              } else {
                this.setState({
                  message: "Payment Failed. You have not been charged",
                });
                console.log("payment failed", paymentRes);
              }
            })
            .catch((err) => console.log("handleCardPaymentErr", err));
        }
        //what if its not successful? Need to code
      });
    }
  };

  replaceExistingCard = (e) => {
    e.preventDefault();
    this.setState({
      replaceExistingCard: true,
    });
  };

  upDateMessage = (msg) => {
    this.setState({ message: msg });
  };

  waitListChange = (e, field, placeInOriginalArray) => {
    let waitList = this.state.waitList;
    let userEvent = this.state.userEvent;
    console.log("lmt1", userEvent.tickets[1]);
    if (field === "waitListSpecificDate") {
      console.log("date triggered");
      userEvent.tickets[placeInOriginalArray][field] = e;
    } else if (field === "numTicketsSought") {
      console.log("else if triggered");
      userEvent.tickets[placeInOriginalArray].buy.numTicketsSought =
        e.target.value;
      //can delete this condition when you remove the buy object - it serves no function
    } else {
      console.log("else triggered");
      userEvent.tickets[placeInOriginalArray][field] = e.target.value;
      console.log("placeInOriginalArray", placeInOriginalArray);
      console.log("field", field);
      console.log("e.target.value", e.target.value);
    }
    console.log("lmt2", userEvent.tickets[1]);
    this.setState({ userEvent });
  };

  render() {
    {
      /**this.state.userEvent.tickets.filter(e => e.finalFewTicket === true).length > 0 || this.state.userEvent.tickets.filter(e => e.ticketTypeID > 0 && e.soldOut === false) )&& <div></div>**/
    }

    let selectedTickets = this.state.userEvent.tickets.filter(e=>e.buy.numTicketsSought > 0)

    let numTicketsSought = this.state.userEvent.tickets
      .filter((e) => {
        return e.buy.numTicketsSought > 0;
      })
      .map((e) => {
        return {
          chargeForTicketsStatus: e.chargeForTicketsStatus,
          chargeForNoShows: e.chargeForNoShows,
          ticketType: e.ticketType,
          ticketTypeID: e.ticketTypeID,
          numTicketsSought: e.buy.numTicketsSought,
          finalFewTicket: e.finalFewTicket,
          lastMinuteTicket: e.lastMinuteTicket,
          resaleOfRefund: e.resaleOfRefund,
        };
      });

    let checkoutForm = (
      <StripeProvider
        apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}
        stripeAccount={this.state.userEvent.organiser.stripeAccountID}
      >
        <Elements>
          <CheckoutForm
            total={this.displayTotal()}
            ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
            moneyForColm={this.displayAdminFee() - this.calculateStripeFee()}
            currency={this.state.userEvent.currency}
            eventTitle={this.state.userEvent.title}
            purchaser={this.state.purchaser}
            userEvent={this.state.userEvent}
            purchaserID={this.state.purchaser}
            replaceExistingCard={this.state.replaceExistingCard}
            cardSaved={this.state.cardDetails.cardSaved}
            upDateMessage={this.upDateMessage}
            numTicketsSought={numTicketsSought}
          />
        </Elements>
      </StripeProvider>
    );


    let totalFines = this.state.userEvent.tickets.map(e=>e.buy.numTicketsSought*e.chargeForNoShows).reduce((a,b) => a+b)

    let checkBoxes = []

    let whenToPlaceHold

    let daysUntilEventEnds = moment(this.state.userEvent.endDetails).diff(Date.now(), 'days')

    if(daysUntilEventEnds <= 5){whenToPlaceHold = 'now'}else{whenToPlaceHold =    `on ${moment(this.state.userEvent.endDetails).subtract(5,'d').format('Do MMM') }`  }
  
    if(selectedTickets.filter(e=>e.price === 0 && e.chargeForNoShows > 0 && !e.hold).length>0){
      checkBoxes.push({text: `I agree to my card being charged €${totalFines} if my ticket(s) are not checked in at the event.`, checkBox: 'chargeNoShows'})
    }else if(selectedTickets.filter(e=>e.price === 0 && e.chargeForNoShows > 0 && e.hold).length>0){
      checkBoxes.push({text: `I agree to a hold of €${totalFines} being placed on my card ${whenToPlaceHold} that will be charged to my account if my ticket(s) are not checked in at the event`, checkBox: 'holdOnCard'})
    }
    
    checkBoxes.push({text: `I agree to sharing my data with the event organiser to enable my attendence at the event`, checkBox: 'shareData'})



    let useSavedCardDisplay = (
      <div className="event-use-saved-card">


        {checkBoxes.map((e,i)=>{return(
        <div key={i} className={`${this.state.checkBoxes[e.checkBox] === false ? 'colorRed': ''}`}>
          <input
            type="checkbox"
            name={e.checkBox}
            // ref={this[e.checkBox]}
            checked={this.state.checkBoxes[e.checkBox]}
            onChange={(event) =>this.handleCheckBoxChange(event)}
           />{` ${e.text}`}
        </div>)})}



      
        
   
        

        <div className="event-confirm-saved-card">
          {`Would you like to secure these tickets using ${this.state.cardDetails.card} card ending in ${this.state.cardDetails.last4}?`}
        </div>
        <button className="event-primary-button" onClick={(e) => this.payWithSavedCard(e, numTicketsSought, selectedTickets)}>
          Yes Please
        </button>
        <button  id="event-secondary-button" onClick={this.replaceExistingCard}>
          No, charge a different card
        </button>
        <div className="event-confirm-ticket-purchase">{this.state.message}</div>
      </div>
    );

    let saveCardDisplay = (
      <StripeProvider apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}>
        <Elements>
          <SaveCardForm
            cardSaved={this.state.cardDetails.cardSaved}
            currency={this.state.userEvent.currency}
            eventTitle={this.state.userEvent.title}
            purchaserID={this.state.purchaser}
            replaceExistingCard={this.state.replaceExistingCard}
            message={this.state.message}
            moneyForColm={this.displayAdminFee() - this.calculateStripeFee()}
            numTicketsSought={numTicketsSought}
            seller={this.state.userEvent.organiser._id}
            stripeAccountID={this.state.userEvent.organiser.stripeAccountID}
            ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
            total={this.displayTotal()}
            upDateMessage={this.upDateMessage}
            userEventID={this.state.userEvent._id}
            waitListData={this.state.userEvent.tickets.filter(
              (e) => e.lastMinuteTicket === true && e.buy.numTicketsSought > 0
            )}
          />
        </Elements>
      </StripeProvider>
    );

    let paymentDisplay;

    if (this.state.userEvent.organiser.stripeAccountID !== "") {
      if (
        this.state.cardDetails.cardSaved === false ||
        this.state.replaceExistingCard === true
      ) {
        paymentDisplay = saveCardDisplay;
      } else {
        paymentDisplay = useSavedCardDisplay;
      }
    }

    let locationArray = [
      this.state.userEvent.venue,
      this.state.userEvent.address1,
      this.state.userEvent.address2,
      this.state.userEvent.address3,
      this.state.userEvent.address4,
    ];

    locationArray.forEach((e, i) => {
      if (e === "") {
        locationArray.splice(i, 1);
      }
    });

    let location = locationArray.join(", ");

    return (
      <>
        <Nav />

        <div className="event-box">
          <img src={this.state.userEvent.imageURL} />

          <section className="event-details">
            <div className="event-center">
              <header>{this.state.userEvent.title}</header>
              <hr />
              <p>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="fontawesome-icon"
                />{" "}
                {moment(this.state.userEvent.startDetails).format(
                  "ddd, D MMM YYYY HH:mm"
                )}{" "}
                until{" "}
                {moment(this.state.userEvent.endDetails).format(
                  "ddd, D MMM YYYY HH:mm"
                )}
              </p>

              <p>
                {" "}
                <FontAwesomeIcon
                  icon={faMapMarker}
                  className="fontawesome-icon"
                />{" "}
                {location}
              </p>

              <p>
                <FontAwesomeIcon
                  icon={faGlobeEurope}
                  className="fontawesome-icon"
                />
                {` `}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${this.state.userEvent.lat},${this.state.userEvent.lng}`}
                  target="_blank"
                >{`View Map`}</a>
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

            <form>
              {this.state.userEvent.tickets
                .filter((e) => {
                  return e.lastMinuteTicket !== true;
                })
                .map((e, i) => {
                  return (
                    <div key={i}>
                      <ColmTicket
                        ticketType={e.ticketType}
                        description={e.ticketDescription}
                        price={e.price}
                        refunds={e.refunds}
                        chargeForNoShows={e.chargeForNoShows}
                        hold={e.hold}
                        quantity={e.buy.numTicketsSought}
                        changeQuantity={this.changeQuantity}
                        i={i}
                      />
                    </div>

                  );
                })}

              <hr />

              {/* <div className="event-credit-card">
                <div className="event-form-body">
               
                  <input
                    required
                    pattern="[0-9]{16}"
                    title="Credit card number must be 16 digits"
                    className="event-card-number"
                    placeholder=" Credit Card Number"
                    name="creditCard"
                    id="creditCard"
                  />

                  <div className="event-date-field">
                    <div className="event-month">
                      <select required name="month" id="month">
                        <option selected value="" hidden>
                          Month
                        </option>
                        <option value="january">Jan</option>
                        <option value="february">Feb</option>
                        <option value="march">Mar</option>
                        <option value="april">Apr</option>
                        <option value="may">May</option>
                        <option value="june">Jun</option>
                        <option value="july">Jul</option>
                        <option value="august">Aug</option>
                        <option value="september">Sep</option>
                        <option value="october">Oct</option>
                        <option value="november">Nov</option>
                        <option value="december">Dec</option>
                      </select>
                    </div>
                    <div className="event-year">
                      <select required name="year" id="year">
                        <option selected value="" hidden>
                          Year
                        </option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                      </select>
                    </div>
                  </div>

                  <div className="event-cvv-input">
                   
                    <input
                      required
                      pattern="[0-9]{3}"
                      title="CVV number must be 3 digits"
                      placeholder="CVV"
                      name="cvv"
                      id="cvv"
                    />
                  </div>

                  

                  <button type="submit">Get Tickets</button>
                </div>
              </div> */}


              {this.state.userEvent.tickets.map(e=>e.buy.numTicketsSought).reduce((a,b)=> a+b)>0 &&      paymentDisplay}


            </form>
          </section>
        </div>

        {/* close of event-description-and-tickets-wrapper div. Tickets and credit card go before this */}
        {/* </div>  */}

        {/* <div id="buyTicketButton">
          <button className="primary">Purchase Tickets</button>
        </div> */}

        

        <div className="sellTickets">
          {this.state.userEvent.tickets.filter((e) => e.lastMinuteTicket)
            .length > 0 && <h4>Bid For Tickets</h4>}
          {this.state.userEvent.tickets
            .filter((e) => e.lastMinuteTicket)
            .map((f) => {
              return (
                <LastMinuteTickets
                  waitListData={{
                    quantity: f.buy.numTicketsSought,
                    maximumPrice: f.price,
                    expires: f.waitListExpires,
                    specificDate: f.waitListSpecificDate,
                    deliverTogether: f.waitListDeliverTogether,
                  }}
                  waitListChange={this.waitListChange}
                  currency={this.state.userEvent.currency}
                  minimumPrice={f.refunds.minimumPrice}
                  placeInOriginalArray={f.placeInOriginalArray}
                  calculateTotals={this.calculateTotals}
                  ticketType={f.ticketType}
                  refundOption={f.refunds.howToResell}
                />
              );
            })}
        </div>
      </>
    );
  }
}

export default Event;
