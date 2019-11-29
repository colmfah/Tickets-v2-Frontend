import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  state = {
    message: "Would you like to complete the purchase?"
  }


  submit = e => {
    e.preventDefault();
    if (this.props.purchaser === "") {
      this.setState({
        message: "You must log in to purchase tickets"
      })
    } else {
      this.setState({
        message: `Checking if tickets are still available`
      });

      let checkForTicketsObject = {
        userEvent: this.props.userEvent._id,
        numTicketsSought: this.props.numTicketsSought
      }

      axios
        .post(
          `${process.env.REACT_APP_API}/checkForTickets`,
          checkForTicketsObject
        )
        .then(res => {
          this.setState({
            message: res.data.message
          });
          if (!res.data.insufficientTickets) {
            this.setState({
              message: "Processing Payment. Please Wait...."
            })
            this.props.stripe.createToken({}).then(res => {
              if (!res.token) {
                this.setState({
                  message:
                    "Invalid Credit Card. Your tickets have not been booked. You have not been charged"
                })
              } else {
                let stripeData = {
                  amount: this.props.total,
                  currency: this.props.currency,
                  description: this.props.eventTitle,
                  source: res.token.id
                }

                axios
                  .post(`${process.env.REACT_APP_API}/pay`, stripeData)
                  .then(res => {
                    this.setState({
                      message:
                        "Payment Successful. Your tickets will be emailed in the next few minutes"
                    })

                    let createTicketData = {
                      purchaser: this.props.purchaser,
                      userEvent: this.props.userEvent,
                      numTicketsSought: this.props.numTicketsSought
                    };

                    axios
                      .post(`${process.env.REACT_APP_API}/ticket`, createTicketData)
                      .then()
                      .catch(err => console.log(err));
                  })
                  .catch(err => {
                    this.setState({
                      message:
                        "Payment Failure. You have not booked tickets for this event. Your card has not been charged"
                    });
                  });
              }
            });
          }
        });
    }
  };

  render() {
    return (
      <div>
        <p>{this.state.message}</p>
        <CardElement />
        <button onClick={this.submit}>
          Purchase
        </button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
