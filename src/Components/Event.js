import React from "react";
import axios from "axios";
import moment from "moment";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import SaveCardForm from "./SaveCardForm";
import Nav from "./Nav";
import LastMinuteTickets from "./LastMinuteTickets";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";




class Event extends React.Component {

	constructor(){
	super()
	this.changeNumTickets= this.changeNumTickets.bind(this)
	this.calculateStripeFee= this.calculateStripeFee.bind(this)
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
			organiser: {_id: '', name: '', stripeAccountID: ''},
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
				},
			}],
    },
		waitList: {
			quantity: 1,
			maximumPrice: '',
			expires: 'starts',
			specificDate: ''
		},
    currency: {
      USD: "$",
      EUR: "€",
      NZD: "$"
    },
    purchaser: "",
		stripeCustomerID: '',
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
		cardDetails:{
			last4: '',
			card: ''
		},
		replaceExistingCard: false,
		message: ''
  }

  componentDidMount() {
			let token = ''
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token")
		}
      let objectToSend = {
        token: token,
				specificEvent: this.props.match.params.id
      };
      axios
        .post(`${process.env.REACT_APP_API}/retrieveEventByID`, objectToSend)
        .then(res => {
          this.setState({
            purchaser: res.data.purchaser,
						cardDetails: res.data.cardDetails,
						stripeCustomerID: res.data.stripeCustomerID,
						userEvent: res.data.userEvent
          });
        })
        .catch(err => console.log('errr', err));

  }

	upDateMessage = (msg) => {
		this.setState({message: msg})
	}

	waitListChange = (e, field, placeInOriginalArray) => {
		console.log('placeInOriginalArray', placeInOriginalArray)
		let waitList = this.state.waitList
		let tickets = this.state.userEvent.tickets
		if (field === 'specificDate'){
			waitList[field] = e
		}else if (field === 'expires') {
			waitList.specificDate = ''
			waitList[field] = e.target.value
		}
		else {
			waitList[field] = e.target.value
		}
		if(field === 'maximumPrice'){
			tickets[placeInOriginalArray].price = e.target.value
		}
		else if(field === 'quantity'){
			tickets[placeInOriginalArray].buy.numTicketsSought = e.target.value
		}
		this.setState({waitList})
	}



	calculateTotals = (data) => {
		console.log('data', data)
		console.log('data.lastMinuteTicket', data.lastMinuteTicket)
			let subTotal = 0
			let fixedCharge = 0
			let variableCharge = 0
			let totalTickets = 0
			let allTickets = this.state.userEvent.tickets
			let purchaseTicketCharges
			let lastMinuteTicketCharges

			let tickets
			if (data.lastMinuteTicket === false){
				console.log('lmt false')
				tickets = this.state.userEvent.tickets.filter(e => e.lastMinuteTicket !== true)
				purchaseTicketCharges = this.state.purchaseTicketCharges
			}else{
				console.log('lmt true')
				tickets = this.state.userEvent.tickets.filter(e => e.lastMinuteTicket === true)
				lastMinuteTicketCharges = this.state.lastMinuteTicketCharges
			}

			console.log('purchaseTicketCharges', purchaseTicketCharges)

			console.log('lastMinuteTicketCharges', lastMinuteTicketCharges)

			let highPriceTickets = tickets.filter(	e => {return e.price > 10}	)
			tickets.forEach(	e => {subTotal += (e.buy.numTicketsSought * e.price) }	)
			tickets.forEach(e => {totalTickets += Number(e.buy.numTicketsSought)})
			if(allTickets.filter(e=>e.ticketTypeID > 0).length === 1){
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

			if (data.lastMinuteTicket === false){
				purchaseTicketCharges.subTotal = subTotal
				purchaseTicketCharges.fixedCharge = fixedCharge
				purchaseTicketCharges.variableCharge= variableCharge
				purchaseTicketCharges.vatOnCharges = vatOnCharges
				this.setState({purchaseTicketCharges})
			} else{
				lastMinuteTicketCharges.subTotal = subTotal
				lastMinuteTicketCharges.fixedCharge = fixedCharge
				lastMinuteTicketCharges.variableCharge= variableCharge
				lastMinuteTicketCharges.vatOnCharges = vatOnCharges
				this.setState({lastMinuteTicketCharges})
			}

	}


  changeNumTickets = (e, i) => {
		let userEvent = this.state.userEvent
		userEvent.tickets[i].buy.numTicketsSought = Number(e.target.value)
    this.setState({
      userEvent: userEvent
    })
  }

displayAdminFee = () => {
return(
	(this.state.purchaseTicketCharges.fixedCharge+this.state.purchaseTicketCharges.variableCharge+this.state.purchaseTicketCharges.vatOnCharges).toFixed(2)
)
	}



	displayTotal = () => {
		return (
			 this.state.purchaseTicketCharges.fixedCharge+this.state.purchaseTicketCharges.variableCharge+this.state.purchaseTicketCharges.subTotal+this.state.purchaseTicketCharges.vatOnCharges
		).toFixed(2)
	}

	calculateStripeFee = () => {
		return (1.23*(0.25 + (0.014)*this.displayTotal()))
	}

	chargeExistingCard = (e) =>{
		e.preventDefault()
		this.setState({message: 'Saving Your Bid. Please Wait...'})
		let objectToSend = {}
		objectToSend.waitListData = this.state.waitList
		objectToSend.purchaserID = this.state.purchaser
		objectToSend.userEventID = this.state.userEvent._id
		axios.post(`${process.env.REACT_APP_API}/chargeExistingCard`, objectToSend).then(res => {
			this.setState({message: res.data.message})
		})
	}

replaceExistingCard = (e) => {
	e.preventDefault()
	this.setState({
		replaceExistingCard: true
	})
}

  render() {

		let numberTicketsAvailable = this.state.userEvent.tickets.map( e => e.ticketsAvailable).reduce((t,i) => t+i)

    return (
      <>
        <Nav />
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





			{this.state.userEvent.tickets.filter(	e => {return(e.lastMinuteTicket !== true &&
				(moment(e.startSellingTime).isSameOrBefore(moment())
				 && moment(e.stopSellingTime).isAfter(moment()))||
				e.startSelling === 'whenPreviousSoldOut' && this.state.userEvent.tickets.find(f => {
					if(e.sellWhenTicketNumberSoldOut === f.ticketTypeID && f.ticketsAvailable < 1){
						return true
					}
				} )
			)}).map(	(e,i) => {return (
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
							onChange={(event) => {this.changeNumTickets(event, i); this.calculateTotals({lastMinuteTicket: false})}}
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
{this.state.userEvent.tickets.filter(e => e.lastMinuteTicket === true).length < 1 && <div>
								<div>
								Subtotal: {this.state.purchaseTicketCharges.subTotal}
								</div>
								<div>
								Fixed Charge: {this.state.purchaseTicketCharges.fixedCharge}
								</div>
								<div>
								Variable Charge: {this.state.purchaseTicketCharges.variableCharge}
								</div>
								<div>
								VAT on charges {this.state.purchaseTicketCharges.vatOnCharges}
								</div>
								<div>
								Total Service Fee: {this.displayAdminFee()}
								</div>
								<div>
								Grand Total: {this.displayTotal()}
								</div>

								<div>Stripe Fee {this.calculateStripeFee()}</div>

{(this.state.userEvent.organiser.stripeAccountID !== '') && 				<StripeProvider
	apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}
	stripeAccount={this.state.userEvent.organiser.stripeAccountID}
>
	<div>
		<Elements>
			<CheckoutForm
				total={
					this.displayTotal()
				}
				moneyForColm={this.displayAdminFee()-this.calculateStripeFee()}
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
}
</div>}



{this.state.userEvent.tickets.filter(e => e.lastMinuteTicket === true).map(f => {return (
	<LastMinuteTickets
	 	waitListData={this.state.waitList}
		waitListChange={this.waitListChange}
		currency={this.state.userEvent.currency}
		minimumPrice={f.refunds.minimumPrice}
		placeInOriginalArray={f.placeInOriginalArray}
		calculateTotals={this.calculateTotals}
		ticketType={f.ticketType}
	/>)})}


{this.state.userEvent.tickets.filter(e => e.lastMinuteTicket === true).length >0 && <div><div>Subtotal: {this.state.lastMinuteTicketCharges.subTotal}</div>
<div>Charges: {this.state.lastMinuteTicketCharges.fixedCharge + this.state.lastMinuteTicketCharges.variableCharge + this.state.lastMinuteTicketCharges.vatOnCharges}</div>
<div>Total: {this.state.lastMinuteTicketCharges.fixedCharge + this.state.lastMinuteTicketCharges.variableCharge + this.state.lastMinuteTicketCharges.vatOnCharges + this.state.lastMinuteTicketCharges.subTotal}</div>


{(this.state.cardDetails.card === '' || this.state.cardDetails.last4 === '' || this.state.replaceExistingCard === true )?	<StripeProvider apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}>
		<Elements>
				<SaveCardForm
				purchaserID={this.state.purchaser}
				waitListData={this.state.waitList}
				userEventID={this.state.userEvent._id}
				replaceExistingCard={this.state.replaceExistingCard}
				message={this.state.message}
				upDateMessage={this.upDateMessage}
				/>
		</Elements>
	</StripeProvider> : <div>Would you like to pay for these tickets using {this.state.cardDetails.card} card ending in {this.state.cardDetails.last4}?
	<button onClick={this.chargeExistingCard}>Yes Please</button>
	<button onClick={this.replaceExistingCard}>No, charge a different card</button>
	<div>{this.state.message}</div>
	</div>}
	</div>
	}



      </>
    );
  }
}

export default Event;
