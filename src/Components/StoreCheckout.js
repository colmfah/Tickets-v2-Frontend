import React, { Component } from "react";
import { Stripe, CardElement, injectStripe, Elements } from "react-stripe-elements";
import SaveCardForm from "./SaveCardForm";



class StoreCheckOut extends Component {





  render() {
    return (

			<Elements>
				<SaveCardForm/>
			</Elements>



    );
  }
}


export default StoreCheckOut;
