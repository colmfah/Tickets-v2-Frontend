import React from "react";
import axios from "axios";
import moment from "moment";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import Nav from "./Nav";


class Event extends React.Component {

	constructor(){
	super()
	this.changeNumTickets= this.changeNumTickets.bind(this)
}


  state = {
    formFields: [
      { label: "Number to Buy", type: "number", value: "price" }
    ],
    userEvent: {
			_id: '',
			image: '',
			region: 'dublin',
			lat: 53.34723555464459,
			lng: -6.258907671241786,
			title: "",
			venue: '',
			address1: '',
			address2: '',
			address3: '',
			address4: '',
			description: "",
			startDetails: "",
			endDetails: "",
			organiser: "",
			currency: "EUR",
			tickets: [{
				ticketType: '',
				ticketTypeID: '',
				price: '',
				numberOfTickets: '',
				sellWhenPrevSoldOut: '',
				startSelling: '',
				stopSelling: '',
				startSellingTime: '',
				stopSellingTime: '',
				ticketDescription: '',
				refunds: {optionSelected: 'excessDemand',
								refundUntil: '',
								howToResell: 'auction',
								resellAtSpecificPrice: '',
								minimumPrice: '',
								nameOfResoldTickets: 'lastMinuteTickets'},
				buy: {
					numTicketsSought: 0
				}

			}],
    },
    currency: {
      USD: "$",
      EUR: "€",
      NZD: "$"
    },
    purchaser: "",
    errorMsg: "",
		charges: {
			subTotal: 0,
			fixedCharge: 0,
			variableCharge: 0,
			vatOnCharges: 0,
		}

  };

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_API}/event/${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          userEvent: res.data
        })
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

	relevantPrevTicketSoldOut = () => {
		let userEvent = this.state.userEvent

		userEvent.tickets.filter(	(e,i) => {return(

			userEvent.tickets.forEach(f => {
				if(e.sellWhenTicketNumberSoldOut === f.ticketTypeID && f.ticketsAvailable < 1){

				}
			})

		)})

	}




	return5 = () =>{
		return 5
	}



	calculateTotals = () => {
			let subTotal = 0
			let fixedCharge = 0
			let variableCharge = 0
			let totalTickets = 0
			let charges = this.state.charges
			let tickets = this.state.userEvent.tickets
			let highPriceTickets = tickets.filter(	e => {return e.price > 10}	)
			tickets.forEach(	e => {subTotal += (e.buy.numTicketsSought * e.price) }	)
			tickets.forEach(e => {totalTickets += Number(e.buy.numTicketsSought)})
			if(tickets.length === 1){
				fixedCharge = totalTickets * 0.49
				if(tickets[0].price > 10){
					variableCharge = (subTotal * 0.04)
				}
			} else {
				fixedCharge = totalTickets * 0.69
				highPriceTickets.forEach( e => {
					variableCharge += (Number(e.buy.numTicketsSought) * e.price * 0.055)
				} )
			}
			let vatOnCharges = 0.23*(fixedCharge + variableCharge)
			charges.subTotal = subTotal
			charges.fixedCharge = fixedCharge
			charges.variableCharge= variableCharge
			charges.vatOnCharges = vatOnCharges
			this.setState({charges})
	}



	prevTicketsSoldOut = (i) => {/*
			let prevTicketsSoldOut = []
			for (j = 0; j < i; j++){
				prevTicketsSoldOut.push(this.state.event.tickets[j].numberOfTickets - this.state.event.tickets[j].ticketsSold + this.state.event.tickets[j].ticketsRefunded)
			}
			const isEqualZero = (currentValue) => currentValue = 0
			return prevTicketsSoldOut.every(isEqualZero)
	*/}

  changeNumTickets = (e, i) => {
		let userEvent = this.state.userEvent
		userEvent.tickets[i].buy.numTicketsSought = Number(e.target.value)
    this.setState({
      userEvent: userEvent
    })
  }

displayAdminFee = () => {
return(
	(this.state.charges.fixedCharge+this.state.charges.variableCharge+this.state.charges.vatOnCharges).toFixed(2)
)
	}

	displayTotal = () => {
		return (
			 this.state.charges.fixedCharge+this.state.charges.variableCharge+this.state.charges.subTotal+this.state.charges.vatOnCharges
		).toFixed(2)
	}

  render() {
    return (
      <>
        <Nav />
				<button onClick={this.relevantPrevTicketSoldOut}>Do Test</button>
              <h3>{this.state.userEvent.organiser.name} Presents:</h3>
              <h1>{this.state.userEvent.title}</h1>
              <h3>
                Date: {moment(this.state.userEvent.startDetails).format("D MMMM")}
              </h3>

              <h3>
                Venue: {this.state.userEvent.venue}
              </h3>
              <h3>
                Doors: {moment(this.state.userEvent.startDetails).format("HH:mm")}
              </h3>


              <h3> Description: </h3>
              <p>{this.state.userEvent.description}</p>

							<img src={this.state.userEvent.imageURL}/>

							<h4>Purchase Tickets</h4>


<button onClick={this.relevantPrevTicketSoldOut}>Do Test</button>
<div>{this.relevantPrevTicketSoldOut()}</div>



			{this.state.userEvent.tickets.filter(	e => {return(
				(moment(e.startSellingTime).isSameOrBefore(moment())
				 && moment(e.stopSellingTime).isAfter(moment()))||
				e.sellWhenPrevSoldOut && this.state.userEvent.tickets.find(f => {
					if(e.sellWhenTicketNumberSoldOut === f.ticketTypeID && f.ticketsAvailable < 1){
						return true
					}
				} ))}).map(	(e,i) => {return (
				<div key={i}>
					<h5>{e.ticketType}</h5>
					<div>{e.ticketDescription}</div>
					<div>{this.state.userEvent.currency}{e.price}</div>
					<div>

			{e.ticketsAvailable < 1 ? <div>Sold Out</div> : <div>
						<label>How Many Tickets?</label>
						<input
							value={e.buy.numTicketsSought}
							required
							onChange={(event) => {this.changeNumTickets(event, i); this.calculateTotals()}}
							type="number"
							min={0}
							max={10}
							// change to take account of when there are less tickets
						/>
						</div>}

									</div>
									<hr />
								</div>
								)}	)}
								<div>
								Subtotal: {this.state.charges.subTotal}
								</div>
								<div>
								Fixed Charge: {this.state.charges.fixedCharge}
								</div>
								<div>
								Variable Charge: {this.state.charges.variableCharge}
								</div>
								<div>
								VAT on charges {this.state.charges.vatOnCharges}
								</div>
								<div>
								Total Service Fee: {this.displayAdminFee()}
								</div>
								<div>
								Grand Total: {this.displayTotal()}
								</div>


				<StripeProvider

					apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}
				>
					<div>
						<Elements>
							<CheckoutForm
								total={
									this.displayTotal()
								}
								currency={this.state.userEvent.currency}
								eventTitle={this.state.userEvent.title}
								purchaser={this.state.purchaser}
								userEvent={this.state.userEvent}
								numTicketsSought={this.state.userEvent.tickets.filter( e => {return e.buy.numTicketsSought > 0}).map(	e => {return ({
									ticketType: e.ticketType,
									ticketTypeID: e.ticketTypeID,
									numTicketsSought: e.buy.numTicketsSought
								})
							}	)}
							/>
						</Elements>
					</div>
				</StripeProvider>

      </>
    );
  }
}

export default Event;
