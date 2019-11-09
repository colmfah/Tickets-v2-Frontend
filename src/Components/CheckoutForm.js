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
  };

  submit = e => {
    e.preventDefault();
    if (this.props.purchaser === "") {
      this.setState({
        message: "You must log in to purchase tickets"
      });
    } else {
      this.setState({
        message: `Checking if ${this.props.numTicketsSought} tickets are still available`
      });

      let checkForTicketsObject = {
        event: this.props.event,
        numTicketsSought: this.props.numTicketsSought
      };

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
            });

            this.props.stripe.createToken({}).then(res => {
              if (!res.token) {
                this.setState({
                  message:
                    "Invalid Credit Card. Your tickets have not been booked. You have not been charged."
                });
              } else {
                let objectToSend = {
                  amount: this.props.total,
                  currency: this.props.currency,
                  description: this.props.description,
                  source: res.token.id
                };

                axios
                  .post(`${process.env.REACT_APP_API}/pay`, objectToSend)
                  .then(res => {
                    this.setState({
                      message:
                        "Payment Successful. Your tickets will be emailed in the next few minutes"
                    });

                    let objectToSend = {
                      purchaser: this.props.purchaser,
                      event: this.props.event,
                      numTicketsSought: this.props.numTicketsSought
                    };

                    axios
                      .post(`${process.env.REACT_APP_API}/ticket`, objectToSend)
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
      <div className="checkout">
        <p>{this.state.message}</p>
        <CardElement />
        <button className="primary" onClick={this.submit}>
          Purchase
        </button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
