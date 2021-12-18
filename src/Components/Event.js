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
    // this.chargeForNoShows = React.createRef()
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
      chargeForNoShows: false,
    },
    errors: [],
    chargeSavedCard: false,
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
        let chargeSavedCard;

        if (!res.data.cardDetails.cardSaved) {
          chargeSavedCard = false;
        } else {
          chargeSavedCard = true;
        }

        this.setState({
          purchaser: res.data.purchaser,
          cardDetails: res.data.cardDetails,
          stripeCustomerID: res.data.stripeCustomerID,
          userEvent: res.data.userEvent,
          chargeSavedCard: chargeSavedCard,
        });
      })
      .catch((err) => console.log("errr", err));
  }

  calculateStripeFee = () => {
    return 1.23 * (0.25 + 0.014 * this.displayTotal());
  };

  calculateTotalFees = (fixedCharge, variableCharge, vat) => {
    return (fixedCharge + variableCharge +vat)
  }

  calculateTotalFines = (tickets) => {
    return tickets
    .map(ticket => ticket.buy.numTicketsSought * ticket.chargeForNoShows)
    .reduce((a, b) => a + b);
  }

  changeQuantity = (i, quantity) => {
    let userEvent = this.state.userEvent;
    userEvent.tickets[i].buy.numTicketsSought = quantity;
    this.setState({ userEvent: userEvent, message: "" });
    this.regularTicketsCalculateTotals();
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

  checkBoxesAreTicked = (selectedTickets) => {
    let checkBoxErrors = [];

    if (!this.state.checkBoxes.shareData) {
      checkBoxErrors.push("shareData");
    }

    if (
      selectedTickets.filter(
        (e) => e.price === 0 && e.chargeForNoShows > 0 && !e.hold
      ).length > 0
    ) {
      if (!this.state.checkBoxes.chargeForNoShows) {
        checkBoxErrors.push("chargeForNoShows");
      }
    } else if (
      selectedTickets.filter(
        (e) => e.price === 0 && e.chargeForNoShows > 0 && e.hold
      ).length > 0
    ) {
      if (!this.state.checkBoxes.holdOnCard) {
        checkBoxErrors.push("holdOnCard");
      }
    }

    if (checkBoxErrors.length > 0) {
      let errors = checkBoxErrors;
      let message = "Please agree to all mandatory terms and conditions";

      this.setState({ errors, message });

      return false;
    } else {
      this.clearMessage();
      return true;
    }
  };

  clearMessage = () => {
    this.setState({ message: "" });
  };

  displayAdminFee = () => {
    return (
      this.state.purchaseTicketCharges.fixedCharge +
      this.state.purchaseTicketCharges.variableCharge +
      this.state.purchaseTicketCharges.vatOnCharges
    ).toFixed(2);
  };


  displayLastMinuteTickets = (tickets) => {

//  return(     
     
//       tickets
//         .filter((e) => e.lastMinuteTicket)
//         .map((f,index) => {
//           return (
//             <div key={index}>
//             <LastMinuteTickets
//               waitListData={{
//                 quantity: f.buy.numTicketsSought,
//                 maximumPrice: f.price,
//                 expires: f.waitListExpires,
//                 specificDate: f.waitListSpecificDate,
//                 deliverTogether: f.waitListDeliverTogether,
//               }}
//               waitListChange={this.waitListChange}
//               currency={this.state.userEvent.currency}
//               minimumPrice={f.refunds.minimumPrice}
//               placeInOriginalArray={f.placeInOriginalArray}
//               calculateTotals={this.calculateTotals}
//               ticketType={f.ticketType}
//               refundOption={f.refunds.howToResell}
//               refunds = {f.refunds}
//               ticket = {f}
//             />
//             </div>
//           );
//         })
  
//  )
}
  

  displayNonLastMinuteTickets = (tickets) => {
    return (tickets.map((ticket, index) => {
        return (
          <div key={index}>
            <ColmTicket
              ticket={ticket}
              ticketType={ticket.ticketType}
              description={ticket.ticketDescription}
              price={ticket.price}
              refunds={ticket.refunds}
              chargeForNoShows={ticket.chargeForNoShows}
              hold={ticket.hold}
              quantity={ticket.buy.numTicketsSought}
              changeQuantity={this.changeQuantity}
              i={index}
            />
          </div>
        );
      }))

  }

  displaySoldOutMessage = () => {
    console.log('Sold the fuck out')
  }

  displayTickets = (tickets) => {
    let regularTickets = tickets.filter(ticket => ticket.lastMinuteTicket !== true)
    if(tickets.length === 0){return this.displaySoldOutMessage()}
    if (regularTickets.length > 0){return this.displayNonLastMinuteTickets(regularTickets)}
    return this.displayLastMinuteTickets(tickets)
    
  }

  displayTotal = () => {
    return (
      this.state.purchaseTicketCharges.fixedCharge +
      this.state.purchaseTicketCharges.variableCharge +
      this.state.purchaseTicketCharges.subTotal +
      this.state.purchaseTicketCharges.vatOnCharges
    ).toFixed(2);
  };

  getConnectedCheckoutForm = (numTicketsSought, selectedTickets) => {

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
            total={this.displayTotal()}
            ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
            moneyForColm={this.displayAdminFee() - this.calculateStripeFee()}
            currency={this.state.userEvent.currency}
            eventTitle={this.state.userEvent.title}
            purchaser={this.state.purchaser}
            userEvent={this.state.userEvent}
            purchaserID={this.state.purchaser}
            // replaceExistingCardStatus={this.state.replaceExistingCard}
            // replaceExistingCard={this.replaceExistingCard}
            upDateMessage={this.upDateMessage}
            numTicketsSought={numTicketsSought}
            errors={this.state.errors}
            selectedTickets={selectedTickets}
            checkBoxesAreTicked={this.checkBoxesAreTicked}
            // saveCard={this.state.checkBoxes.saveCard}
            // chargeSavedCard={this.state.chargeSavedCard}
            // connected={true}
            // cardDetails={this.state.cardDetails}
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

    locationArray.forEach((e, i) => {
      if (e === "") {
        locationArray.splice(i, 1);
      }
    });

    return locationArray.join(", ");
  }

  getNumberTicketsSought = (allTickets) => {
    return allTickets
    .filter(ticket =>ticket.buy.numTicketsSought > 0)
    .map(ticket => {
      return {
        chargeForTicketsStatus: ticket.chargeForTicketsStatus,
        chargeForNoShows: ticket.chargeForNoShows,
        ticketType: ticket.ticketType,
        ticketTypeID: ticket.ticketTypeID,
        numTicketsSought: ticket.buy.numTicketsSought,
        finalFewTicket: ticket.finalFewTicket,
        lastMinuteTicket: ticket.lastMinuteTicket,
        resaleOfRefund: ticket.resaleOfRefund,
      };
    });
  }

  getSelectedTickets = (allTickets) => {
    return allTickets.filter(ticket => ticket.buy.numTicketsSought > 0)
  };

  getUnconnectedCheckoutForm = (numTicketsSought, selectedTickets) => {
    if(this.state.userEvent.organiser.stripeAccountID === ""){return}
    return (
      <StripeProvider apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}>
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
            replaceExistingCardStatus={this.state.replaceExistingCard}
            replaceExistingCard={this.replaceExistingCard}
            upDateMessage={this.upDateMessage}
            numTicketsSought={numTicketsSought}
            errors={this.state.errors}
            selectedTickets={selectedTickets}
            checkBoxesAreTicked={this.checkBoxesAreTicked}
            saveCard={this.state.checkBoxes.saveCard}
            chargeSavedCard={this.state.chargeSavedCard}
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

  payWithSavedCard = (e, numTicketsSought, selectedTickets) => {
    e.preventDefault();

    if (!this.checkBoxesAreTicked(selectedTickets)) {
      return;
    } else {
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

          console.log("res.data", res.data);

          // if (res.data.success) {
          //   this.props.stripe
          //     .handleCardPayment(res.data.clientSecret, {})
          //     .then((paymentRes) => {
          //       if (paymentRes.error) {
          //         this.setState({ message: paymentRes.error.message }); // run some javascript to make the text red.
          //         axios.post(`${process.env.REACT_APP_API}/deleteTempTickets`, {
          //           tickets: res.data.tickets,
          //           refunds: res.data.refundRequests,
          //           ticketsAlreadyRefunded: res.data.ticketsAlreadyRefunded,
          //         }); //amend to include overdue refunds
          //         //i've never tested this. also need to include it anywhere else payment might fail

          //         {
          //           /*Secuirty Issue: There is a window here for hacker to manually post the tickets to backend to make them valid using updateTicketData controller*/
          //         }
          //       } else if (paymentRes.paymentIntent.status === "succeeded") {
          //         let updateTicketData = {
          //           purchaser: this.props.purchaser,
          //           tickets: res.data.tickets,
          //           ticketsAlreadyRefunded: res.data.ticketsAlreadyRefunded,
          //           refundRequests: res.data.refundRequests,
          //           paymentIntentID: paymentRes.paymentIntent.id,
          //           userEvent: this.props.userEvent._id,
          //         };

          //         axios
          //           .post(
          //             `${process.env.REACT_APP_API}/emailTickets`,
          //             updateTicketData
          //           )
          //           .then((res) => {
          //             this.setState({ message: res.data.message });
          //           })
          //           .catch((err) => console.log("create tickets err", err));
          //       } else {
          //         this.setState({
          //           message: "Payment Failed. You have not been charged",
          //         });
          //         console.log("payment failed", paymentRes);
          //       }
          //     })
          //     .catch((err) => console.log("handleCardPaymentErr", err));
          // }
          //what if its not successful? Need to code
        });
    }
  };

  regularTicketsCalculateTotals = () => {
    let subTotal = 0;
    let fixedCharge = 0;
    let variableCharge = 0;
    let totalTickets = 0;
    let purchaseTicketCharges = {};

    let tickets = this.state.userEvent.tickets.filter(
      (e) => e.buy.numTicketsSought > 0 && e.price > 0
    );

    let highPriceTickets = tickets.filter((e) => e.price > 10);

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

    purchaseTicketCharges.subTotal = subTotal;
    purchaseTicketCharges.fixedCharge = fixedCharge;
    purchaseTicketCharges.variableCharge = variableCharge;
    purchaseTicketCharges.vatOnCharges = vatOnCharges;
    this.setState({ purchaseTicketCharges });
  };

  replaceExistingCard = (e) => {
    e.preventDefault();
    this.setState({
      replaceExistingCard: true,
      chargeSavedCard: false,
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

    let selectedTickets = this.getSelectedTickets(this.state.userEvent.tickets)
    let numTicketsSought = this.getNumberTicketsSought(this.state.userEvent.tickets)
    let totalFines = this.calculateTotalFines(this.state.userEvent.tickets)
    let fees = this.calculateTotalFees(this.state.purchaseTicketCharges.fixedCharge, 
      this.state.purchaseTicketCharges.variableCharge, 
      this.state.purchaseTicketCharges.vatOnCharges)
    let checkBoxes = [{
      text: `I agree to share my data with the event organiser.`,
      checkBox: "shareData",
    }];
    let checkoutFormConnected = this.getConnectedCheckoutForm(numTicketsSought, selectedTickets)    
    let checkoutFormNotConnected = this.getUnconnectedCheckoutForm(numTicketsSought, selectedTickets)
    let location = this.getLocation(this.state.userEvent) 



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


{/* display Tickets function 

Func needs to be improved. ticket.length>1 .... what if there are no refunds allowed. 
Sold out message needed

*/}



            <form>
              {
               this.displayTickets(this.state.userEvent.tickets)

                
                }

              <hr />

              <div className="event-details-before-payment">
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
                          this.handleCheckBoxChange(event, selectedTickets)
                        }
                      />
                      {` ${e.text}`}
                    </div>
                  );
                })}

                <hr />

                <div>
                  Subtotal: €
                  {this.state.purchaseTicketCharges.subTotal.toFixed(2)}
                </div>
                <div>Fees: €{fees.toFixed(2)}</div>
                <div className="event-total-charge">
                  Total: €
                  {(this.state.purchaseTicketCharges.subTotal + fees).toFixed(
                    2
                  )}
                </div>

                <hr id="event-total-charge-bottom-hr" />
              </div>

              {checkoutFormConnected}

           
            </form>
          </section>
        </div>


      </>
    );
  }
}

export default Event;






    
 


{


// let whenToPlaceHold;

// let daysUntilEventEnds = moment(this.state.userEvent.endDetails).diff(
//   Date.now(),
//   "days"
// );

// if (daysUntilEventEnds <= 5) {
//   whenToPlaceHold = "now";
// } else {
//   whenToPlaceHold = `on ${moment(this.state.userEvent.endDetails)
//     .subtract(5, "d")
//     .format("Do MMM")}`;
// }
}



{
  //checkboxes

  // if (
  //   selectedTickets.filter(
  //     (e) => e.price === 0 && e.chargeForNoShows > 0 && !e.hold
  //   ).length > 0
  // ) {
  //   checkBoxes.push({
  //     text: `I agree to my card being charged €${totalFines} if my ticket(s) are not checked in at the event.`,
  //     checkBox: "chargeForNoShows",
  //   });
  // } else if (
  //   selectedTickets.filter(
  //     (e) => e.price === 0 && e.chargeForNoShows > 0 && e.hold
  //   ).length > 0
  // ) {
  //   checkBoxes.push({
  //     text: `I agree to a hold of €${totalFines} being placed on my card ${whenToPlaceHold} that will be charged to my account if my ticket(s) are not checked in at the event.`,
  //     checkBox: "holdOnCard",
  //   });
  // }

  // if (!this.state.cardDetails.cardSaved || this.state.replaceExistingCard) {
  //   checkBoxes.push({
  //     text: `Save my card for future use`,
  //     checkBox: "saveCard",
  //   });
  // }
}