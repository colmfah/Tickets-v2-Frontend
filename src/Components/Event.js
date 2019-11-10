import React from "react";
import axios from "axios";
import moment from "moment";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import Nav from "./Nav";


class Event extends React.Component {
  state = {
    formFields: [
      { label: "Number of Tickets", type: "number", value: "price" }
    ],
    event: {
      _id: "",
      title: "",
      location: "",
      price: 0,
      description: "",
      startDetails: {},
      endDetails: {},
      organiser: {
        _id: "",
        name: ""
      },
      currency: "",
      ticketsRemaining: 0,
      numTicketsSold: 0
    },
    currency: {
      USD: "$",
      EUR: "€",
      NZD: "$"
    },
    numTicketsSought: 1,
    purchaser: "",
    errorMsg: "",
    total: 20
  };

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_API}/events/${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          event: res.data
        });
      })
      .catch(err => console.log(err));

    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      let objectToSend = {
        token: token
      };
      axios
        .post(`${process.env.REACT_APP_API}/auth`, objectToSend)
        .then(res => {
          this.setState({
            purchaser: res.data._id
          });
        })
        .catch(err => console.log(err));
    }
  }

  changeNumTickets = e => {
    this.setState({
      numTicketsSought: Number(e.target.value)
    });
  };

	displaySubTotal = () => {
		return (this.state.numTicketsSought * this.state.event.price)
	}

	displayAdminFee = () => {
		return           (
                  0.69 +
                  0.055 * this.state.numTicketsSought * this.state.event.price
                ).toFixed(2)
	}

	displayTotal = () => {
		return (
			this.state.numTicketsSought * this.state.event.price +
			0.69 +
			0.055 * this.state.numTicketsSought * this.state.event.price
		).toFixed(2)
	}

  render() {
    return (
      <>
        <Nav />
              <h3>{this.state.event.organiser.name} Presents:</h3>
              <h1>{this.state.event.title}</h1>
              <h3>
                Date: {moment(this.state.event.startDetails).format("D MMMM")}
              </h3>
              <h3>
                Price: {this.state.currency[this.state.event.currency]}
                {this.state.event.price} {this.state.event.currency}
              </h3>
              <h3>
                Venue: {this.state.event.location}
              </h3>
              <h3>
                Doors: {moment(this.state.event.startDetails).format("HH:mm")}
              </h3>


              <h3> Description: </h3>
              <p>{this.state.event.description}</p>


            <form onSubmit={this.buyTickets}>
              {this.state.formFields.map((e, i) => (
                <div key={i}>
                  <label>{e.label}</label>
                  <input
                    value={this.state.numTicketsSought}
                    required
                    onChange={this.changeNumTickets}
                    type={e.type}
                    min={1}
                    max={
                      this.state.event.ticketsRemaining < 10
                        ? this.state.event.ticketsRemaining
                        : 10
                    }
                  />
                </div>
              ))}
							
              <div>
                {`Price: `} {this.state.currency[this.state.event.currency]}{this.displaySubTotal()}

                {`Admin Fee: `}{this.state.currency[this.state.event.currency]}{this.displayAdminFee()}

                {`Total: `}
                {this.state.currency[this.state.event.currency]}{this.displayTotal()}
              </div>

              <p>{this.state.errorMsg}</p>


              <StripeProvider

                apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}
              >
                <div>
                  <Elements>
                    <CheckoutForm
                      total={
                        this.displayTotal()
                      }
                      currency={this.state.event.currency}
                      description={this.state.event.title}
                      purchaser={this.state.purchaser}
                      event={this.state.event._id}
                      numTicketsSought={this.state.numTicketsSought}
                    />
                  </Elements>
                </div>
              </StripeProvider>
            </form>

      </>
    );
  }
}

export default Event;
