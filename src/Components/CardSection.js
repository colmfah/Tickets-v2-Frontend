import React, { Component } from "react";
import { Stripe, CardElement, injectStripe } from "react-stripe-elements";


class CardSection extends Component {





  render() {
    return (
      <div>
        <CardElement />
      </div>
    );
  }
}


export default CardSection;
