import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  state = {
    chargeSubmittedCardNowDetails: { message: "", success: false },
    overall: { message: "", success: false },
    message: ''
  };

  sendPaymentIntent = (props, chargeSavedCardNow) => {
    this.setState({ message: "Checking for tickets. Please Wait..." });

    let objectToSend = {
      ticketTypesEquivalent: props.ticketTypesEquivalent,
      saveCard: props.saveCard,
      // paymentMethodID: paymentMethodID,
      chargeSavedCardNow: chargeSavedCardNow,

      checkForTickets: {
        userEvent: props.userEvent._id,
        numTicketsSought: props.numTicketsSought,
        purchaser: props.purchaser,
      },
      stripeData: {
        amount: props.total,
        currency: props.currency,
        seller: props.userEvent.organiser._id,
        description: props.eventTitle,
        moneyForColm: props.moneyForColm,
      },
    };

    axios
      .post(`${process.env.REACT_APP_API}/paymentIntent`, objectToSend)
      .then((res) => {
        if (res.data.chargeSubmittedCardNow.success) {
          //how do I code if free tickets (no hold) are mixed in with these tickets. When does the res.data for free tickets display?

          this.setState({ message: res.data.chargeSubmittedCardNow.message });

          const cardElement = props.elements.getElement("card");

          let paymentMethod = {
            payment_method: {
              card: cardElement,
            },
          };

          props.stripe
            .confirmCardPayment(res.data.clientSecret, paymentMethod)

            .then((paymentRes) => {
              if (paymentRes.error) {
                this.setState({ message: paymentRes.error.message });
                axios.post(`${process.env.REACT_APP_API}/deleteTempTickets`, {
                  tickets: res.data.tickets,
                  refunds: res.data.refundRequests,
                  ticketsAlreadyRefunded: res.data.ticketsAlreadyRefunded,
                }); //amend to include overdue refunds
                //i've never tested this. also need to include it anywhere else payment might fail

                {
                  /*Secuirty Issue: There is a window here for hacker to manually post the tickets to backend to make them valid using updateTicketData controller*/
                  // Can I overcome this by using some id from payment Res?
                }
              } else if (paymentRes.paymentIntent.status === "succeeded") {
                let updateTicketData = {
                  purchaser: props.purchaser,
                  tickets: res.data.tickets,
                  ticketsAlreadyRefunded: res.data.ticketsAlreadyRefunded,
                  refundRequests: res.data.refundRequests,
                  paymentIntentID: paymentRes.paymentIntent.id,
                  userEvent: props.userEvent._id,
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

        let overall = this.state.overall;
        overall.message = res.data.overall.message;
        overall.success = res.data.overall.success;

        this.setState({ overall });
      });
  };



  submit = (e, selectedTickets) => {
    e.preventDefault();

    if (!this.props.checkBoxesAreTicked(selectedTickets)) {
      return;
    } else if (this.props.purchaser === "") {
      this.setState({ message: "You must log in to purchase tickets" });
    } else {
      let chargeSubmittedCardNowDetails = this.state.chargeSubmittedCardNowDetails;
      chargeSubmittedCardNowDetails.message =
        "Checking for tickets. Please Wait...";

      this.setState({ chargeSubmittedCardNowDetails });

      let objectToSend = {
        ticketTypesEquivalent: this.props.ticketTypesEquivalent,

        checkForTickets: {
          userEvent: this.props.userEvent._id,
          numTicketsSought: this.props.numTicketsSought,
          purchaser: this.props.purchaser,
        },
        stripeData: {
          amount: this.props.total,
          currency: this.props.currency,
          seller: this.props.userEvent.organiser._id,
          description: this.props.eventTitle,
          moneyForColm: this.props.moneyForColm,
        },
      };

      axios
        .post(`${process.env.REACT_APP_API}/paymentIntent`, objectToSend)
        .then((res) => {

          console.log('res.data', res.data)
      
          let chargeSubmittedCardNowDetails = this.state
            .chargeSubmittedCardNowDetails;
          chargeSubmittedCardNowDetails.message =
            res.data.chargeSubmittedCardNow.message;
          chargeSubmittedCardNowDetails.success =
            res.data.chargeSubmittedCardNow.success;
          let overall = this.state.overall;
          overall.message = res.data.overall.message;
          overall.success = res.data.overall.success;

          this.setState({ chargeSubmittedCardNowDetails, overall });

          const cardElement = this.props.elements.getElement("card");

          let paymentMethod = {
            payment_method: {
              card: cardElement,
            },
          };

          if (res.data.chargeSubmittedCardNow.success) {
            this.props.stripe
              // .handleCardPayment(res.data.clientSecret, {})
              .confirmCardPayment(
                res.data.chargeSubmittedCardNow.clientSecret,
                paymentMethod
              )

              .then((paymentRes) => {
                console.log("paymentRes", paymentRes);
                if (paymentRes.error) {
                  let chargeSubmittedCardNowDetails = this.state
                    .chargeSubmittedCardNowDetails;
                  chargeSubmittedCardNowDetails.message =
                    paymentRes.error.message;
                  this.setState(chargeSubmittedCardNowDetails);

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
                  let chargeSubmittedCardNowDetails = this.state
                    .chargeSubmittedCardNowDetails;
                  chargeSubmittedCardNowDetails.message =
                    "Please Wait. Creating Tickets....";
                  this.setState(chargeSubmittedCardNowDetails);

                  let updateTicketData = {
                    purchaser: this.props.purchaser,
                    tickets: res.data.chargeSubmittedCardNow.tickets,
                    ticketsAlreadyRefunded:
                      res.data.chargeSubmittedCardNow.ticketsAlreadyRefunded,
                    refundRequests:
                      res.data.chargeSubmittedCardNow.refundRequests,
                    paymentIntentID: paymentRes.paymentIntent.id,
                    userEvent: this.props.userEvent._id,
                  };

                  axios
                    .post(
                      `${process.env.REACT_APP_API}/emailTickets`,
                      updateTicketData
                    )
                    .then((res) => {
                      let chargeSubmittedCardNowDetails = this.state
                        .chargeSubmittedCardNowDetails;
                      chargeSubmittedCardNowDetails.message =
                        "Payment Successful. Your tickets will be emailed to you shortly";
                      chargeSubmittedCardNowDetails.success = true;
                      this.setState(chargeSubmittedCardNowDetails);

                      //code for failure - promise all settled rather than catch?
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
          }else{
            //code for failure here
          }


        });
    }
  };

  render() {
    return (
      <div>
        <div>{this.state.chargeSubmittedCardNowDetails.message}</div>
        <div>{this.state.overall.message}</div>
            <CardElement />
            <button onClick={(e) => this.submit(e, this.props.selectedTickets)}>
              {`Purchase Tickets`}
            </button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);


// saveCard = () => {

//   //saves card but it doesnt charge it

//   // let chargeSavedCardNowDetails = this.state.chargeSavedCardNowDetails;
//   // chargeSavedCardNowDetails.message = "Saving your card. Please Wait";
//   // this.setState({ chargeSavedCardNowDetails });

//   // axios
//   // .post(`${process.env.REACT_APP_API}/saveNewCard`, {
//   //   purchaserID: this.props.purchaserID,
//   //   replaceExistingCard: this.props.replaceExistingCardStatus,
//   // }).then((res) => {
//   //   const cardElement = this.props.elements.getElement("card");

//   //   this.props.stripe
//   //     .confirmCardSetup(res.data.clientSecret, {
//   //       payment_method: {
//   //         card: cardElement,
//   //       },
//   //     })
//   //     .then((data) => {
//   //       if (data.error) {
//   //         console.log("data.error", data.error);

//   //         let chargeSavedCardNowDetails = this.state
//   //           .chargeSavedCardNowDetails;
//   //         chargeSavedCardNowDetails.message = data.error.message;
//   //         chargeSavedCardNowDetails.success = false;

//   //         this.setState({ chargeSavedCardNowDetails });
//   //       } else {
//   //         let chargeSavedCardNowDetails = this.state.chargeSavedCardNowDetails;
//   //         chargeSavedCardNowDetails.message =
//   //           "Card Details Saved. Charging Card. Please Wait...";

//   //         this.setState({ chargeSavedCardNowDetails });

//   //         let chargeSavedCardNow = true;

//   //         this.sendPaymentIntent(this.props, chargeSavedCardNow);
//   //       }
//   //     });
//   // }).catch(err => {
//   //   console.log('err', err)
//   // });

// }






// else if (this.props.chargeSavedCard) {
//   let chargeSavedCardNowDetails = this.state.chargeSavedCardNowDetails;
//   chargeSavedCardNowDetails.message = "Charging Card. Please Wait...";

//   this.setState({ chargeSavedCardNowDetails });

//   let chargeSavedCardNow = true;

//   this.sendPaymentIntent(this.props, chargeSavedCardNow);
// }


